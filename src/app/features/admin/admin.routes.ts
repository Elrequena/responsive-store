import { Routes } from '@angular/router';
import { Admin } from './admin';
export default [
  { path: '', component: Admin, data: { section: 'dashboard' } },
  { path: 'products', component: Admin, data: { section: 'products' } },
  { path: 'categories', component: Admin, data: { section: 'categories' } },
  { path: 'orders', component: Admin, data: { section: 'orders' } },
  { path: 'orders/:id', component: Admin, data: { section: 'orders' } },
  { path: 'users', component: Admin, data: { section: 'users' } },
  { path: 'inventory', component: Admin, data: { section: 'inventory' } },
  { path: 'coupons', component: Admin, data: { section: 'coupons' } }
] satisfies Routes;
