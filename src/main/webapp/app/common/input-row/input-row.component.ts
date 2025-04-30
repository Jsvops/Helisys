import { KeyValuePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorsComponent } from 'app/common/input-row/input-errors.component';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  imports: [ReactiveFormsModule, InputErrorsComponent, KeyValuePipe],
  styleUrls: ['./input-row.component.css']
})
export class InputRowComponent implements AfterViewInit, OnChanges, OnInit {

  @Input({ required: true })
  group!: FormGroup;

  @Input({ required: true })
  field!: string;

  @Input()
  rowType = 'text';

  @Input()
  inputClass = '';

  @Input()
  options?: Record<string, string> | Map<number, string>;

  @Input({ required: true })
  label!: string;

  @Input()
  datepicker?: 'datepicker' | 'timepicker' | 'datetimepicker';

  @Input()
  required = false;

  control?: AbstractControl; // Definido como opcional sin incluir null

  optionsMap?: Map<string | number, string>;

  private elRef = inject(ElementRef);

  ngOnInit() {
    this.control = this.group.get(this.field) ?? undefined;
  }

  ngOnChanges() {
    if (!this.options || this.options instanceof Map) {
      this.optionsMap = this.options;
    } else {
      this.optionsMap = new Map(Object.entries(this.options));
    }
  }

  ngAfterViewInit() {
    this.initDatepicker();
  }

  @HostListener('input', ['$event.target'])
  onEvent(target: HTMLInputElement) {
    if (target.value === '') {
      this.control?.setValue(null);
    }
  }

  isRequired(): boolean {
    if (this.required) return true;
    if (!this.control) return false;

    const validator = this.control.validator;
    if (validator) {
      const validationResult = validator({} as AbstractControl);
      return !!validationResult?.['required'] || !!validationResult?.['requiredTrue'];
    }

    return false;
  }

  getInputClasses() {
    return (this.hasErrors() ? 'is-invalid ' : '') + this.inputClass;
  }

  hasErrors() {
    return !!this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  private initDatepicker() {
    if (!this.datepicker) return;

    const flatpickrConfig: any = {
      allowInput: true,
      time_24hr: true,
      enableSeconds: true
    };

    if (this.datepicker === 'datepicker') {
      flatpickrConfig.dateFormat = 'Y-m-d';
    } else if (this.datepicker === 'timepicker') {
      flatpickrConfig.enableTime = true;
      flatpickrConfig.noCalendar = true;
      flatpickrConfig.dateFormat = 'H:i:S';
    } else {
      flatpickrConfig.enableTime = true;
      flatpickrConfig.altInput = true;
      flatpickrConfig.altFormat = 'Y-m-d H:i:S';
      flatpickrConfig.dateFormat = 'Y-m-dTH:i:S';
      flatpickrConfig.onReady = () => {
        const input = this.elRef.nativeElement.querySelector('input');
        if (input) {
          const id = input.id;
          input.id = '';
          this.elRef.nativeElement.querySelector('.flatpickr-alt-input').id = id;
        }
      };
    }

    const input = this.elRef.nativeElement.querySelector('input');
    if (input) {
      const flatpicker = flatpickr(input, flatpickrConfig);
      this.control?.valueChanges.subscribe(val => {
        flatpicker.setDate(val);
      });
    }
  }

  isTcoTceField(): boolean {
    return this.field === 'tcoTce';
  }
}
