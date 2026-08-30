import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notifications = inject(NotificationService);
  return next(request).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401 && !request.url.includes('/auth/refresh') && auth.refreshToken) {
      return auth.tryRefresh().pipe(
        switchMap(() => next(request.clone({ setHeaders: { Authorization: `Bearer ${auth.accessToken}` } }))),
        catchError(refreshError => {
          auth.logout();
          void router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
          return throwError(() => refreshError);
        })
      );
    }
    if (error.status !== 401) {
      const raw = error.error?.message;
      const message = Array.isArray(raw) ? raw.join(', ') : raw;
      notifications.show(message || 'El laboratorio tuvo un pequeño incendio digital.', 'error');
    }
    return throwError(() => error);
  }));
};
