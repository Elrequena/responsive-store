import { Address } from './user.model';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productSlug: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost?: number;
  total: number;
  shippingAddress: Address;
  notes?: string | null;
  createdAt: string;
  message?: string;
}
