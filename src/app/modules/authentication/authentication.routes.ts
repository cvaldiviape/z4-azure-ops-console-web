import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';

export const AUTHENTICATION_ROUTES: Routes = [
  { path: 'sign-in', component: SignIn, title: 'Ingresar · Z4 Ops' },
  { path: '**', redirectTo: 'sign-in' },
];
