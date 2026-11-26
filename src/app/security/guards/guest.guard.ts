import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

// Si ya hay sesión de ADMIN, no tiene sentido volver al login: va directo a la consola.
export const guestGuard: CanMatchFn = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  return jwtService.isAuthAdmin() ? router.parseUrl('/admin') : true;
};
