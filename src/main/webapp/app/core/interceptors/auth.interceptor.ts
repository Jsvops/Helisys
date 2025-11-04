import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

let redirecting = false;

function isApi(url: string): boolean {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname.startsWith('/api/');
  } catch {
    return url.startsWith('/api/');
  }
}

function shouldSkip(url: string): boolean {

  return /\/api\/(public|auth)\/|\/api\/me\b/.test(url);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const withCreds = req.clone({ withCredentials: true });

  return next(withCreds).pipe(
    tap({
      error: (err: any) => {
        const onLogin = window.location.pathname.startsWith('/login');

        const navInProgress =
          typeof document !== 'undefined' && (
            document.visibilityState === 'hidden' ||
            (('prerendering' in document) && (document as any).prerendering === true)
          );

        if (
          err instanceof HttpErrorResponse &&
          err.status === 401 &&
          isApi(req.url) &&
          !shouldSkip(req.url) &&
          !onLogin &&
          !redirecting &&
          !navInProgress
        ) {
          redirecting = true;
          window.location.href = '/login';
          setTimeout(() => (redirecting = false), 1500);
        }
      }
    })
  );
};

