import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.token) req = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });
  return next(req).pipe(catchError(e => {
    if (e.status === 401 && !req.url.includes('/auth/')) { auth.logout(); router.navigate(['/login']); }
    return throwError(() => e);
  }));
};
