import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartResponse, Coupon } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

const STORAGE_KEY = 'requena-labs-cart';

function readGuestCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CartItem[];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  readonly items = signal<CartItem[]>(readGuestCart());
  readonly coupon = signal<Coupon | null>(null);
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  readonly discount = computed(() => this.coupon()?.discount ?? 0);
  readonly total = computed(() => Math.max(0, this.subtotal() - this.discount()));

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.load();
    }
  }

  async load(): Promise<void> {
    if (!this.auth.isLoggedIn()) return;
    const cart = await firstValueFrom(this.api.get<CartResponse>('/cart'));
    this.items.set(cart.items ?? []);
  }

  async mergeOnLogin(): Promise<void> {
    const payload = this.items().map(({ productId, quantity }) => ({ productId, quantity }));
    if (payload.length) {
      await firstValueFrom(this.api.post<CartResponse>('/cart/merge', { items: payload }));
    }
    await this.load();
    localStorage.removeItem(STORAGE_KEY);
  }

  add(product: Product, quantity = 1): void {
    const found = this.items().find((item) => item.productId === product.productId);
    this.items.update((items) =>
      found
        ? items.map((item) =>
            item.productId === product.productId ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...items, { productId: product.productId, product, quantity }],
    );
    this.persist();
    if (this.auth.isLoggedIn()) {
      this.api.post<CartResponse>('/cart/items', { productId: product.productId, quantity }).subscribe({
        next: (cart) => this.items.set(cart.items),
      });
    }
    this.notification.show('Excelente decision cuestionable. Producto agregado.', 'success');
  }

  update(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }
    const current = this.items().find((item) => item.productId === productId);
    this.items.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
    this.persist();
    if (this.auth.isLoggedIn() && current?.cartItemId) {
      this.api.patch<CartResponse>(`/cart/items/${current.cartItemId}`, { quantity }).subscribe({
        next: (cart) => this.items.set(cart.items),
      });
    }
  }

  remove(productId: number): void {
    const current = this.items().find((item) => item.productId === productId);
    this.items.update((items) => items.filter((item) => item.productId !== productId));
    this.persist();
    if (this.auth.isLoggedIn() && current?.cartItemId) {
      this.api.delete<CartResponse>(`/cart/items/${current.cartItemId}`).subscribe({
        next: (cart) => this.items.set(cart.items ?? []),
        error: () => undefined,
      });
    }
  }

  validateCoupon(code: string) {
    return this.api.post<Coupon>('/coupons/validate', { code, cartTotal: this.subtotal() });
  }

  applyCoupon(coupon: Coupon): void {
    this.coupon.set(coupon);
  }

  clear(): void {
    this.items.set([]);
    this.coupon.set(null);
    this.persist();
  }

  private persist(): void {
    if (this.auth.isLoggedIn()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }
}
