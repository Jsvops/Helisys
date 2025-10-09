import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { getGlobalErrorMessage } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-input-errors',
  templateUrl: './input-errors.component.html',
  imports: [KeyValuePipe]
})
export class InputErrorsComponent {

  @Input({ required: true })
  control?: AbstractControl;


  private customErrorMessages: Record<string, string> = {
    required: 'Este campo es obligatorio',
    email: 'Por favor ingresa un correo electrónico válido',
    minlength: 'El campo debe tener al menos ${requiredLength} caracteres'
  };

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  getMessage(key: string, details?: any): string {
    if (this.customErrorMessages[key]) {
      return this.replacePlaceholders(this.customErrorMessages[key], details);
    }

    const globalErrorMessage = getGlobalErrorMessage(key, details);
    return globalErrorMessage || key;
  }

  private replacePlaceholders(message: string, details: any): string {
    if (!details) return message;

    return message.replace(/\${(\w+)}/g, (_, prop) => {
      return details[prop] || '';
    });
  }
}
