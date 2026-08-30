import { Product } from './product.model';

export interface CartItem {
  cartItemId?: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  subtotal: number;
  message?: string;
}

export interface Coupon {
  valid?: boolean;
  code: string;
  discount: number;
  discountType?: 'percentage' | 'fixed_amount';
  value?: number;
  message?: string;
}
