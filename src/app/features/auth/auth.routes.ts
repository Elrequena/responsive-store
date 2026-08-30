import { Routes } from '@angular/router';
import { Auth } from './auth';
export default [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Auth },
  { path: 'register', component: Auth }
] satisfies Routes;
