import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';

// Solo deja cargar el área de la consola a un usuario con sesión vigente y rol ADMIN.
export const adminGuard: CanMatchFn = () => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  return jwtService.isAuthAdmin() ? true : router.parseUrl('/auth/sign-in');
};
