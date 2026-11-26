import { Routes } from '@angular/router';
import { adminGuard } from './security/guards/admin.guard';
import { guestGuard } from './security/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./router/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canMatch: [guestGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./router/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canMatch: [adminGuard], // si no es ADMIN, ni siquiera se descarga el código de la consola
  },
  { path: '**', redirectTo: 'admin' },
];
