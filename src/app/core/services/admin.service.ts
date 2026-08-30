import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Order, OrderStatus } from '../models/order.model';
import { User } from '../models/user.model';
import { Paginated } from '../models/api-response.model';
import { Tag } from '../models/product.model';

export interface AdminCoupon {
  couponId: number;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  value: number;
  minPurchase: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

function unwrap<T>(source: Observable<T[] | Paginated<T>>) {
  return source.pipe(map((value) => (Array.isArray(value) ? value : value.data)));
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  products() {
    return unwrap(this.api.get<Paginated<Product>>('/admin/products', { limit: 100 }));
  }
  saveProduct(data: Record<string, unknown>, id?: number) {
    return id
      ? this.api.patch<Product>(`/admin/products/${id}`, data)
      : this.api.post<Product>('/admin/products', data);
  }
  deleteProduct(id: number) {
    return this.api.delete<void>(`/admin/products/${id}`);
  }
  categories() {
    return this.api.get<Category[]>('/admin/categories');
  }
  saveCategory(data: Partial<Category>, id?: number) {
    return id
      ? this.api.patch<Category>(`/admin/categories/${id}`, data)
      : this.api.post<Category>('/admin/categories', data);
  }
  deleteCategory(id: number) {
    return this.api.delete<void>(`/admin/categories/${id}`);
  }
  orders() {
    return unwrap(this.api.get<Paginated<Order>>('/admin/orders', { limit: 100 }));
  }
  updateOrder(id: number, status: OrderStatus) {
    return this.api.patch<Order>(`/admin/orders/${id}/status`, { status });
  }
  users() {
    return unwrap(this.api.get<Paginated<User>>('/admin/users', { limit: 100 }));
  }
  inventory() {
    return unwrap(this.api.get<Paginated<Product>>('/admin/inventory', { limit: 100 }));
  }
  updateStock(id: number, stock: number) {
    return this.api.patch(`/admin/inventory/${id}`, { stock });
  }
  alerts() {
    return this.api.get<Product[]>('/admin/inventory/alerts');
  }
  coupons() {
    return this.api.get<AdminCoupon[]>('/admin/coupons');
  }
  saveCoupon(data: Partial<AdminCoupon>, id?: number) {
    return id
      ? this.api.patch<AdminCoupon>(`/admin/coupons/${id}`, data)
      : this.api.post<AdminCoupon>('/admin/coupons', data);
  }
  deleteCoupon(id: number) {
    return this.api.delete<void>(`/admin/coupons/${id}`);
  }
  tags() {
    return this.api.get<Tag[]>('/tags');
  }
}
