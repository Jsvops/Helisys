import { KeyValuePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorsComponent } from 'app/common/input-row/input-errors.component';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  imports: [ReactiveFormsModule, InputErrorsComponent, KeyValuePipe]
})
export class InputRowComponent implements AfterViewInit, OnChanges, OnInit {

  @Input({ required: true })
  group?: FormGroup;

  @Input({ required: true })
  field = '';

  @Input()
  rowType = 'text';

  @Input()
  inputClass = '';

  @Input()
  options?: Record<string, string> | Map<number, string>; // Acepta un Map o un Record

  @Input({ required: true })
  label = '';

  @Input()
  datepicker?: 'datepicker' | 'timepicker' | 'datetimepicker';

  control?: AbstractControl;
  optionsMap?: Map<string | number, string>; // Mapa para almacenar las opciones

  elRef = inject(ElementRef);

  ngOnInit() {
    this.control = this.group!.get(this.field)!;
  }

  ngOnChanges() {
    if (!this.options || this.options instanceof Map) {
      // Si options es un Map o no está definido, lo asignamos directamente
      this.optionsMap = this.options;
    } else {
      // Si options es un Record, lo convertimos a un Map
      this.optionsMap = new Map(Object.entries(this.options));
    }
  }

  ngAfterViewInit() {
    this.initDatepicker();
  }

  @HostListener('input', ['$event.target'])
  onEvent(target: HTMLInputElement) {
    if (target.value === '') {
      this.control!.setValue(null);
    }
  }

  isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  getInputClasses() {
    return (this.hasErrors() ? 'is-invalid ' : '') + this.inputClass;
  }

  hasErrors() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  initDatepicker() {
    if (!this.datepicker) {
      return;
    }
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
    } else { // datetimepicker
      flatpickrConfig.enableTime = true;
      flatpickrConfig.altInput = true;
      flatpickrConfig.altFormat = 'Y-m-d H:i:S';
      flatpickrConfig.dateFormat = 'Y-m-dTH:i:S';
      // workaround label issue
      flatpickrConfig.onReady = function () {
        const id = this.input.id;
        this.input.id = null;
        this.altInput.id = id;
      };
    }
    const input = this.elRef.nativeElement.querySelector('input');
    const flatpicker = flatpickr(input, flatpickrConfig);
    this.control!.valueChanges.subscribe(val => {
      // update in case value changes after initialization
      flatpicker.setDate(val);
    });
  }

  // Método para verificar si el campo es tcoTce
  isTcoTceField(): boolean { return this.field === 'tcoTce'; }
}
