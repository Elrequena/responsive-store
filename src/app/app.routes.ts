import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductDetail } from './features/product-detail/product-detail';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', loadChildren: () => import('./features/catalog/catalog.routes') },
      { path: 'product/:slug', component: ProductDetail },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', canActivate: [authGuard], loadChildren: () => import('./features/checkout/checkout.routes') },
      { path: 'auth', loadChildren: () => import('./features/auth/auth.routes') },
      { path: 'profile', canActivate: [authGuard], loadChildren: () => import('./features/profile/profile.routes') },
      { path: '**', component: NotFound }
    ]
  }
];
