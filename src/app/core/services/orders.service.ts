import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';
import { Order } from '../models/order.model';
import { Paginated } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly api = inject(ApiService);
  list() {
    return this.api.get<Paginated<Order>>('/orders', { limit: 50 }).pipe(map((result) => result.data));
  }
  get(id: number) {
    return this.api.get<Order>(`/orders/${id}`);
  }
  create(data: { addressId?: number; shippingAddress?: unknown; couponCode?: string; notes?: string }) {
    return this.api.post<Order>('/orders', data);
  }
  cancel(id: number) {
    return this.api.patch<Order>(`/orders/${id}/cancel`, {});
  }
}
