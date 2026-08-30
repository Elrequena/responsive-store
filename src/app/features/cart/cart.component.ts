import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CartService } from '../../core/services/cart.service';
import { primaryImage } from '../../core/models/product.model';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink, TranslocoPipe],
  template: `
    <section class="page container"><p class="eyebrow">PROTOCOLO DE ADQUISICIÓN</p><h1>{{'cart.title'|transloco}}</h1>
      @if(cart.items().length){<div class="layout"><div class="items">@for(item of cart.items();track item.productId){<article><img [src]="image(item.product)" [alt]="item.product.name"><div><h3>{{item.product.name}}</h3><p>{{item.product.shortDescription}}</p><button (click)="cart.remove(item.productId)">Eliminar</button></div><div class="qty"><button (click)="cart.update(item.productId,item.quantity-1)">−</button><b>{{item.quantity}}</b><button (click)="cart.update(item.productId,item.quantity+1)">+</button></div><strong>{{item.product.price*item.quantity|currency:'USD'}}</strong></article>}</div>
        <aside class="panel"><h2>Resumen</h2><div><span>{{'cart.subtotal'|transloco}}</span><b>{{cart.subtotal()|currency:'USD'}}</b></div><div><span>{{'cart.discount'|transloco}}</span><b>−{{cart.discount()|currency:'USD'}}</b></div><div class="total"><span>{{'cart.total'|transloco}}</span><b>{{cart.total()|currency:'USD'}}</b></div><form (submit)="coupon($event)"><input [(ngModel)]="couponCode" name="coupon" [placeholder]="'cart.coupon'|transloco"><button class="btn btn-ghost">{{'cart.apply'|transloco}}</button></form><button class="btn btn-primary checkout" (click)="checkout()">{{'cart.checkout'|transloco}}</button></aside>
      </div>}@else{<div class="empty"><i class="fa-solid fa-vial-circle-check"></i><h2>{{'cart.empty'|transloco}}</h2><a class="btn btn-primary" routerLink="/catalog">{{'home.cta'|transloco}}</a></div>}
    </section>
  `,
  styles: [`
    h1{font-size:clamp(2.6rem,5vw,4rem);margin:12px 0 35px}
    .layout{display:grid;grid-template-columns:1fr 340px;gap:28px;align-items:start}
    .layout>*{min-width:0}
    .items{display:grid;gap:12px}
    .items article{display:grid;grid-template-columns:110px 1fr auto 90px;gap:18px;align-items:center;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px}
    .items img{width:110px;height:90px;object-fit:cover;border-radius:6px;flex-shrink:0}
    .items h3{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .items p{color:var(--text-muted);font-size:.8rem;margin:4px 0 0}
    .items div>button{border:0;background:none;color:var(--danger);padding:4px 0;font-size:.8rem;font-weight:600}
    .qty{display:flex;align-items:center;gap:10px}
    .qty button{border:1px solid var(--border)!important;color:var(--text)!important;background:var(--bg-surface)!important;width:30px;height:30px;border-radius:5px}
    .panel{display:grid;gap:16px;position:sticky;top:92px}
    .panel>div{display:flex;justify-content:space-between}
    .panel .total{border-top:1px solid var(--border);padding-top:16px;font-size:1.15rem}
    .panel form{display:grid;grid-template-columns:1fr auto;gap:7px}
    .checkout{width:100%}
    @media(max-width:800px){.layout{grid-template-columns:1fr}.panel{position:static}.items article{grid-template-columns:80px 1fr}.items img{width:80px;height:70px}.items article>strong,.qty{grid-column:2}}
  `]
})
export class CartComponent {
  readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  couponCode = '';
  coupon(event: Event): void { event.preventDefault(); this.cart.validateCoupon(this.couponCode).subscribe({next:c=>{this.cart.applyCoupon(c);this.notifications.show('Descuento aplicado. Ahora gastas un poco menos en cosas que no necesitas.','success')}}); }
  checkout(): void { void this.router.navigate(this.auth.isLoggedIn()?['/checkout']:['/auth/login'], this.auth.isLoggedIn()?{}:{queryParams:{returnUrl:'/checkout'}}); }
  image(product: Product): string { return primaryImage(product); }
}
