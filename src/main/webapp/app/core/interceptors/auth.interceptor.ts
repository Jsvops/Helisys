// src/main/webapp/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Enviar cookies de sesión (JSESSIONID) en TODAS las llamadas HttpClient
  const withCreds = req.clone({ withCredentials: true });

  return next(withCreds).pipe(
    tap({
      error: (err: any) => {
        // Si el backend devuelve 401 (sesión expirada/expulsada) -> ir al login
        if (err?.status === 401) {
          window.location.replace('/login?error'); // el login por defecto muestra aviso con ?error
        }
      }
    })
  );
};
