import { Routes } from '@angular/router';
import { Profile } from './profile';
export default [
  { path: '', component: Profile },
  { path: 'orders/:id', component: Profile },
  { path: 'addresses', component: Profile }
] satisfies Routes;
