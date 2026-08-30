import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { ScreenSizeService } from '../../core/services/screen-size.service';
import { ThemeService } from '../../core/services/theme.service';
import { primaryImage } from '../../core/models/product.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, TranslocoPipe, CurrencyPipe],
  template: `
    <header>
      <div class="nav container">
        <a class="logo" routerLink="/"><i class="fa-solid fa-flask-vial"></i><span>REQUENA LABS<small>SUPPLY</small></span></a>
        @if (!screen.isMobile() || menuOpen()) {
          <nav><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">{{'nav.home'|transloco}}</a><a routerLink="/catalog" routerLinkActive="active">{{'nav.catalog'|transloco}}</a></nav>
        }
        <form (submit)="search($event)"><input [(ngModel)]="query" name="q" [placeholder]="'nav.search'|transloco"><button><i class="fa-solid fa-magnifying-glass"></i></button></form>
        <div class="tools">
          <button (click)="language.toggle()">{{language.language().toUpperCase()}}</button>
          <button (click)="theme.toggle()"><i [class]="theme.theme()==='dark'?'fa-solid fa-sun':'fa-solid fa-moon'"></i></button>
          <button class="cart" (click)="drawerOpen.set(true)"><i class="fa-solid fa-cart-shopping"></i>@if(cart.count()){<b>{{cart.count()}}</b>}</button>
          @if (auth.isLoggedIn()) {
            <a routerLink="/profile"><i class="fa-solid fa-user-astronaut"></i></a>
            @if (auth.isAdmin()) { <a routerLink="/admin"><i class="fa-solid fa-screwdriver-wrench"></i></a> }
          } @else {
            <a routerLink="/auth/login"><i class="fa-solid fa-right-to-bracket"></i></a>
          }
          @if(screen.isMobile()){<button (click)="menuOpen.set(!menuOpen())"><i class="fa-solid fa-bars"></i></button>}
        </div>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer><div class="container"><a class="logo" routerLink="/"><i class="fa-solid fa-flask-vial"></i> REQUENA LABS SUPPLY</a><p>{{'footer.brand'|transloco}}</p><div><a routerLink="/catalog">{{'nav.catalog'|transloco}}</a> · <a routerLink="/profile">{{'nav.profile'|transloco}}</a></div></div></footer>
    @if(drawerOpen()){
      <div class="overlay" (click)="drawerOpen.set(false)"></div>
      <aside class="drawer"><div class="drawer-head"><h2>{{'cart.title'|transloco}}</h2><button (click)="drawerOpen.set(false)">×</button></div>
        @if(cart.items().length){@for(item of cart.items();track item.productId){<div class="mini"><img [src]="image(item.product)" [alt]="item.product.name"><div><b>{{item.product.name}}</b><small>{{item.quantity}} × {{item.product.price|currency:'USD'}}</small></div><button (click)="cart.remove(item.productId)">×</button></div>}<div class="drawer-total"><span>{{'cart.total'|transloco}}</span><b>{{cart.total()|currency:'USD'}}</b></div><a class="btn btn-primary" routerLink="/cart" (click)="drawerOpen.set(false)">{{'nav.cart'|transloco}}</a>}@else{<div class="empty"><i class="fa-solid fa-vial-circle-check"></i><p>{{'cart.empty'|transloco}}</p></div>}
      </aside>
    }
    <div class="toasts">@for(toast of notifications.toasts();track toast.id){<button [class]="toast.type" (click)="notifications.dismiss(toast.id)"><i class="fa-solid fa-bolt"></i>{{toast.message}}</button>}</div>
  `,
  styles: `
    :host{display:flex;flex-direction:column;min-height:100vh}
    header{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
    .nav{height:72px;display:flex;align-items:center;gap:20px}
    .logo{display:flex;align-items:center;gap:9px;font:700 .9rem "Space Grotesk";letter-spacing:.08em;white-space:nowrap;flex-shrink:0}
    .logo i{font-size:1.4rem;color:var(--accent)}
    .logo small{display:block;color:var(--accent);font:700 .55rem "JetBrains Mono";letter-spacing:.22em}
    nav{display:flex;gap:18px;flex-shrink:0}nav a{font-size:.87rem;color:var(--text-muted);white-space:nowrap;transition:color .15s}nav a.active,nav a:hover{color:var(--accent)}
    form{margin-left:auto;display:flex;max-width:280px;flex:1;min-width:0}form input{border-radius:8px 0 0 8px;width:100%;padding:9px 12px;min-width:0}form button{border:0;border-radius:0 8px 8px 0;background:var(--accent);color:#07120d;width:42px;flex-shrink:0}
    .tools{display:flex;align-items:center;gap:4px;flex-shrink:0}
    .tools button,.tools>a{border:0;background:transparent;color:var(--text);min-width:36px;height:36px;display:grid;place-items:center;border-radius:6px;transition:.15s}
    .tools button:hover,.tools>a:hover{color:var(--accent);background:var(--bg-surface)}
    .cart{position:relative}.cart b{position:absolute;right:-2px;top:-4px;background:var(--danger);color:#fff;border-radius:50%;font:700 .6rem "JetBrains Mono";min-width:17px;padding:2px;text-align:center}
    main{flex:1}
    footer{border-top:1px solid var(--border);padding:20px 0;color:var(--text-muted)}footer .container{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}footer .logo{font-size:.8rem}footer p{font-size:.8rem;margin:0}
    .overlay{position:fixed;inset:0;background:#0009;z-index:50;animation:fadeIn .15s}
    .drawer{position:fixed;z-index:51;right:0;top:0;height:100vh;width:min(420px,92vw);background:var(--bg-card);padding:24px;box-shadow:-16px 0 50px #0008;display:flex;flex-direction:column;overflow-y:auto;animation:slideIn .2s}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
    .drawer-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:18px;flex-shrink:0}
    .drawer-head button{border:0;background:none;color:var(--text);font-size:1.5rem}
    .mini{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)}
    .mini img{width:64px;height:55px;object-fit:cover;border-radius:6px}
    .mini b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .mini small{display:block;color:var(--text-muted)}
    .mini button{border:0;background:none;color:var(--text-muted);font-size:1.3rem;transition:color .15s}
    .mini button:hover{color:var(--danger)}
    .drawer-total{display:flex;justify-content:space-between;align-items:center;margin-top:18px;padding-top:18px;border-top:1px solid var(--border)}
    .drawer .btn{width:100%;margin-top:12px}
    .toasts{position:fixed;right:20px;top:88px;z-index:80;display:grid;gap:10px}
    .toasts button{max-width:360px;border:1px solid var(--border);border-left:3px solid var(--accent);background:var(--bg-card);color:var(--text);padding:14px 16px;border-radius:8px;box-shadow:0 12px 30px #0006;text-align:left;animation:fadeIn .2s}
    .toasts i{color:var(--accent);margin-right:9px}
    .toasts .error{border-left-color:var(--danger)}
    @media(max-width:576px){.nav{height:62px;gap:5px}.logo span{display:none}.nav form{position:absolute;top:62px;left:0;right:0;max-width:none;background:var(--bg);padding:8px 11px;border-bottom:1px solid var(--border)}main{padding-top:54px}nav{position:absolute;top:116px;left:0;right:0;background:var(--bg-card);padding:16px;z-index:4}footer .container{display:grid;text-align:center;justify-items:center;gap:12px}.toasts{left:12px;right:12px}.toasts button{max-width:none}}
  `,
})
export class PublicLayout {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly language = inject(LanguageService);
  readonly screen = inject(ScreenSizeService);
  readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly drawerOpen = signal(false);
  readonly menuOpen = signal(false);
  query = '';
  search(event: Event): void { event.preventDefault(); void this.router.navigate(['/catalog'], { queryParams: { q: this.query || null } }); }
  image(product: Product): string { return primaryImage(product); }
}
