import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Order } from '../../core/models/order.model';
import { Address } from '../../core/models/user.model';
import { AddressesService } from '../../core/services/addresses.service';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink, TranslocoPipe],
  template: `
    <section class="page container"><div class="head"><div><p class="eyebrow">EXPEDIENTE PERSONAL</p><h1>{{'profile.title'|transloco}}</h1></div><button class="btn btn-ghost" (click)="logout()">{{'nav.logout'|transloco}}</button></div>
      <div class="profile-grid"><aside class="panel"><div class="avatar">{{auth.currentUser()?.firstName?.charAt(0)}}{{auth.currentUser()?.lastName?.charAt(0)}}</div><h2>{{auth.currentUser()?.firstName}} {{auth.currentUser()?.lastName}}</h2><p class="muted">{{auth.currentUser()?.email}}</p>@if(auth.isAdmin()){<a class="btn btn-primary" routerLink="/admin">Abrir administración</a>}</aside>
        <div><section class="panel"><h2>{{'profile.orders'|transloco}}</h2>@if(orders().length){@for(order of orders();track order.orderId){<article class="order"><div><b>#{{order.orderNumber}}</b><small>{{order.createdAt|date:'mediumDate'}}</small></div><span>{{order.status}}</span><strong>{{order.total|currency:'USD'}}</strong></article>}}@else{<p class="muted">Aún no hay evidencia de malas decisiones.</p>}</section>
        <section class="panel addresses"><h2>{{'profile.addresses'|transloco}}</h2>@for(address of addresses();track address.addressId){<article><div><b>{{address.label}}</b><p>{{address.street}}, {{address.city}}</p></div><button (click)="removeAddress(address.addressId)">×</button></article>}<div class="form"><input [(ngModel)]="draft.label" placeholder="Etiqueta"><input [(ngModel)]="draft.firstName" placeholder="Nombre"><input [(ngModel)]="draft.lastName" placeholder="Apellido"><input [(ngModel)]="draft.street" placeholder="Calle"><input [(ngModel)]="draft.city" placeholder="Ciudad"><input [(ngModel)]="draft.state" placeholder="Estado"><input [(ngModel)]="draft.zipCode" placeholder="Código postal"><input [(ngModel)]="draft.country" placeholder="País"><button class="btn btn-primary" (click)="addAddress()">Añadir dirección</button></div></section></div>
      </div>
    </section>
  `,
  styles: `
    .head{display:flex;justify-content:space-between;align-items:end;margin-bottom:30px;flex-wrap:wrap;gap:12px}
    .head h1{font-size:clamp(2.4rem,5vw,3.5rem);margin-top:10px}
    .profile-grid{display:grid;grid-template-columns:280px 1fr;gap:22px;align-items:start}
    .profile-grid>*{min-width:0}
    .profile-grid>aside{text-align:center;position:sticky;top:92px}
    .avatar{width:90px;height:90px;border-radius:50%;display:grid;place-items:center;margin:0 auto 16px;background:var(--accent);color:#07120d;font:700 1.8rem "Space Grotesk"}
    .profile-grid aside .btn{margin-top:20px}
    .profile-grid>div{display:grid;gap:20px}
    .panel h2{margin-bottom:18px}
    .order,.addresses article{display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:center;padding:13px 0;border-bottom:1px solid var(--border)}
    .order small{display:block;color:var(--text-muted)}
    .order span{color:var(--accent);font:600 .7rem "JetBrains Mono";text-transform:uppercase}
    .addresses article button{border:0;background:none;color:var(--danger);font-size:1.3rem}
    .form{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:20px}
    .form .btn{grid-column:1/-1}
    @media(max-width:700px){.profile-grid{grid-template-columns:1fr}.profile-grid>aside{position:static}.form{grid-template-columns:1fr}}
  `,
})
export class Profile {
  readonly auth = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly addressesService = inject(AddressesService);
  private readonly router = inject(Router);
  readonly orders = signal<Order[]>([]); readonly addresses = signal<Address[]>([]);
  draft: Partial<Address> = { country: 'México' };
  constructor(){this.reload();}
  logout():void{this.auth.logout();void this.router.navigate(['/']);}
  addAddress():void{this.addressesService.create(this.draft).subscribe(()=>{this.draft={country:'México'};this.reloadAddresses()});}
  removeAddress(id:number):void{this.addressesService.remove(id).subscribe(()=>this.reloadAddresses());}
  private reload():void{this.ordersService.list().subscribe(v=>this.orders.set(v));this.reloadAddresses();}
  private reloadAddresses():void{this.addressesService.list().subscribe(v=>this.addresses.set(v));}
}
