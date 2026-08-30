import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
  const lang = inject(TranslocoService).getActiveLang() || 'es';
  return next(request.clone({ setHeaders: { 'Accept-Language': lang } }));
};
