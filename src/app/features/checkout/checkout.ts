import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Address } from '../../core/models/user.model';
import { AddressesService } from '../../core/services/addresses.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe, RouterLink, TranslocoPipe],
  template: `
    <section class="page container"><p class="eyebrow">PROTOCOLO FINAL</p><h1>{{'checkout.title'|transloco}}</h1><div class="steps"><span [class.active]="step()>=1">1 {{'checkout.address'|transloco}}</span><span [class.active]="step()>=2">2 {{'checkout.summary'|transloco}}</span><span [class.active]="step()>=3">3 {{'checkout.confirmation'|transloco}}</span></div>
      <div class="panel content">@switch(step()){@case(1){<h2>¿Dónde entregamos el experimento?</h2>@if(addresses().length){<div class="saved">@for(address of addresses();track address.addressId){<label><input type="radio" name="address" [value]="address.addressId" [(ngModel)]="addressId"><b>{{address.label}}</b> {{address.street}}, {{address.city}}</label>}</div>}<p class="muted">O proporciona una dirección nueva:</p><div class="form"><input [(ngModel)]="shipping.label" placeholder="Etiqueta (casa, oficina)"><input [(ngModel)]="shipping.firstName" placeholder="Nombre"><input [(ngModel)]="shipping.lastName" placeholder="Apellido"><input [(ngModel)]="shipping.street" placeholder="Calle"><input [(ngModel)]="shipping.city" placeholder="Ciudad"><input [(ngModel)]="shipping.state" placeholder="Estado"><input [(ngModel)]="shipping.zipCode" placeholder="Código postal"><input [(ngModel)]="shipping.country" placeholder="País"><input [(ngModel)]="shipping.phone" placeholder="Teléfono"></div><button class="btn btn-primary" (click)="step.set(2)">Revisar experimento →</button>}@case(2){<h2>Última oportunidad de actuar con prudencia</h2>@for(item of cart.items();track item.productId){<div class="line"><span>{{item.quantity}} × {{item.product.name}}</span><b>{{item.quantity*item.product.price|currency:'USD'}}</b></div>}<div class="line total"><span>Total</span><b>{{cart.total()|currency:'USD'}}</b></div><button class="btn btn-primary" (click)="pay()">{{'checkout.pay'|transloco:{total:(cart.total()|currency:'USD')} }}</button>}@case(3){<div class="confirmed"><i class="fa-solid fa-circle-check"></i><h2>{{'checkout.confirmed'|transloco}}</h2><p>{{'checkout.order'|transloco}}: <code>{{orderNumber()}}</code></p><a class="btn btn-primary" routerLink="/profile">Ver expediente</a></div>}}</div>
    </section>
  `,
  styles: `
    h1{font-size:clamp(2.5rem,5vw,4rem);margin:12px 0 28px}
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px}
    .steps span{padding:12px;border-bottom:2px solid var(--border);color:var(--text-muted);font:600 .72rem "JetBrains Mono";text-align:center;transition:color .15s,border-color .15s}
    .steps .active{color:var(--accent);border-color:var(--accent)}
    .content{max-width:760px;margin:auto}
    .content h2{margin-bottom:22px}
    .saved{display:grid;gap:9px;margin-bottom:20px}
    .saved label{padding:13px;border:1px solid var(--border);border-radius:6px;display:flex;gap:10px;align-items:center;cursor:pointer;transition:border-color .15s}
    .saved label:hover{border-color:var(--accent)}
    .form{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:15px 0 20px}
    .line{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
    .line.total{font-size:1.2rem;margin-bottom:20px}
    .confirmed{text-align:center;padding:40px}
    .confirmed>i{font-size:4rem;color:var(--accent)}
    .confirmed h2{margin:18px}
    .confirmed code{color:var(--accent);font-size:1.1rem}
    .confirmed .btn{margin-top:24px}
    @media(max-width:576px){.form{grid-template-columns:1fr}.steps span{font-size:.6rem;padding:10px 6px}}
  `,
})
export class Checkout {
  readonly cart = inject(CartService);
  private readonly addressesService = inject(AddressesService);
  private readonly orders = inject(OrdersService);
  readonly step = signal(1); readonly addresses = signal<Address[]>([]); readonly orderNumber = signal('');
  addressId: number | null = null; shipping: Partial<Address> = { country: 'México', label: 'Casa' };
  constructor(){this.addressesService.list().subscribe(v=>this.addresses.set(v));}
  pay(): void {
    const payload = this.addressId
      ? { addressId: Number(this.addressId), couponCode: this.cart.coupon()?.code }
      : { shippingAddress: this.shipping, couponCode: this.cart.coupon()?.code };
    this.orders.create(payload).subscribe(order => { this.orderNumber.set(order.orderNumber); this.cart.clear(); this.step.set(3); });
  }
}
