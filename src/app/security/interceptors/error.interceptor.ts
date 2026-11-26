import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { PathRest } from '../../modules/authentication/static/path-rest';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { JwtService } from '../services/jwt.service';

// Errores comunes a toda la consola. El login maneja los suyos en su propia pantalla.
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  const snackBarService = inject(SnackBarService);
  const isLoginRequest = request.url.startsWith(PathRest.LOGIN);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isLoginRequest) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        jwtService.logout();
        void router.navigate(['/auth/sign-in'], { queryParams: { reason: 'expired' } });
      } else if (error.status === 403) {
        snackBarService.showWarning('No tienes permisos para esta acción.', 'top right');
      } else if (error.status === 0) {
        snackBarService.showError('No se pudo conectar con el servidor.', 'top right');
      } else {
        const message = error.error?.message ?? 'Ocurrió un error inesperado.';
        snackBarService.showError(message, 'top right');
      }

      return throwError(() => error);
    }),
  );
};
