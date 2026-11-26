import { Routes } from '@angular/router';
import { AdminLayout } from '../../shared/components/layouts/admin-layout/admin-layout';

// Área de la consola: sidebar + navbar, y cada módulo se carga al entrar.
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'saga',
        loadChildren: () => import('../../modules/saga/saga.routes').then((m) => m.SAGA_ROUTES),
      },
      { path: '**', redirectTo: 'saga' },
    ],
  },
];
