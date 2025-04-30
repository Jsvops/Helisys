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

  // Mapeo de mensajes personalizados
  private customErrorMessages: Record<string, string> = {
    required: 'Este campo es obligatorio',  // Mensaje personalizado para validación required
    // Puedes agregar más mensajes personalizados aquí
    email: 'Por favor ingresa un correo electrónico válido',
    minlength: 'El campo debe tener al menos ${requiredLength} caracteres'
  };

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  getMessage(key: string, details?: any): string {
    // Primero verifica si hay un mensaje personalizado
    if (this.customErrorMessages[key]) {
      return this.replacePlaceholders(this.customErrorMessages[key], details);
    }

    // Si no, usa el mensaje global
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
