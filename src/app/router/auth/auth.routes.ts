import { Routes } from '@angular/router';
import { AuthLayout } from '../../shared/components/layouts/auth-layout/auth-layout';

// Área sin sesión: el login dentro del layout centrado.
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    loadChildren: () => import('../../modules/authentication/authentication.routes').then((m) => m.AUTHENTICATION_ROUTES),
  },
];
