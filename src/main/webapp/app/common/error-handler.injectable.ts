import { inject, Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorHandler {

  router = inject(Router);
  snackBar = inject(MatSnackBar);

  /**
   * Maneja errores del servidor. Si hay fieldErrors, los mapea al form.
   * Si es un caso de negocio (p.ej., 409 stock insuficiente), muestra snackbar y NO navega a /error.
   * 5xx -> /error. Otros 4xx -> snackbar.
   */
  handleServerError(err: HttpErrorResponse | ErrorResponse, group?: FormGroup, getMessage?: (key: string) => string) {

    const http = err as HttpErrorResponse;
    const status: number | undefined =
      typeof http?.status === 'number' ? http.status : (err as ErrorResponse)?.status;

    const body: any = (http && http.error !== undefined) ? http.error : (err as ErrorResponse);
    const code: string | undefined = body?.code;
    const detail: string =
      body?.detail || body?.message || http?.message || 'Ocurrió un error';


    const isInsufficient =
      status === 409 ||
      code === 'INSUFFICIENT_STOCK' ||
      /stock insuficiente/i.test(detail);

    if (isInsufficient) {
      this.snackBar.open(
        'No se puede completar la transacción: stock insuficiente en los lotes disponibles ℹ️',
        '',
        { duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        }
      );
      return;
    }


    const fieldErrors: FieldError[] | undefined = body?.fieldErrors;
    if (fieldErrors?.length) {
      const errorsMap: Record<string, ValidationErrors> = {};
      for (const fe of fieldErrors) {
        const fieldName = fe.property;
        if (!errorsMap[fieldName]) errorsMap[fieldName] = {};
        let errorMessage = getGlobalErrorMessage(fe.code) || fe.code;
        if (getMessage) {
          errorMessage =
            getMessage(`${fe.property}.${fe.code}`) ||
            getMessage(fe.code) ||
            errorMessage;
        }
        errorsMap[fieldName][fe.code] = errorMessage;
      }
      for (const [key, value] of Object.entries(errorsMap)) {
        group?.get(key)?.setErrors(value);
      }
      return;
    }

    if (typeof status === 'number' && status >= 500) {
      this.router.navigate(['/error'], {
        state: { errorStatus: '' + status, errorMessage: detail || 'Internal Server Error' }
      });
      return;
    }


    this.snackBar.open(detail || 'Ocurrió un error', '', {
      duration: 3000, verticalPosition: 'top', horizontalPosition: 'center'
    });
  }


  updateForm(group: FormGroup, data: any) {
    for (const field in group.controls) {
      const control = group.get(field)!;
      const value = data[field] ?? null;
      control.setValue(value);
    }
  }
}

export function getGlobalErrorMessage(key: string, details?: any) {
  const globalErrorMessages: Record<string, string> = {
    required: $localize`:@@required:Please provide a value.`,
    maxlength: $localize`:@@maxlength:Your value must have a length of less then ${details?.requiredLength} characters.`,
    REQUIRED_NOT_NULL: $localize`:@@required:Please provide a value.`
  };
  return globalErrorMessages[key];
}

interface FieldError {
  code: string;
  property: string;
  message: string;
  rejectedValue: any|null;
  path: string|null;
}

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  fieldErrors?: FieldError[];
}
