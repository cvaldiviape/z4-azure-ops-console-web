import { Routes } from '@angular/router';
import { SagaDetail } from './components/saga-detail/saga-detail';
import { SagaList } from './components/saga-list/saga-list';

export const SAGA_ROUTES: Routes = [
  { path: 'list', component: SagaList, title: 'Sagas · Z4 Ops' },
  { path: 'detail/:orderId', component: SagaDetail, title: 'Detalle de Saga · Z4 Ops' },
  { path: '**', redirectTo: 'list' },
];
