import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const withCreds = req.clone({ withCredentials: true });

  return next(withCreds).pipe(
    tap({
      error: (err: any) => {

        if (err?.status === 401) {
          window.location.replace('/login?error');
        }
      }
    })
  );
};
