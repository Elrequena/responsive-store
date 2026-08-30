import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, primaryImage } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';

const FALLBACK = 'https://placehold.co/600x450/161625/00e68a?text=RLS';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <article class="card">
      <a class="visual" [routerLink]="['/product', product().slug]">
        <img [src]="imgSrc()" [alt]="product().name" loading="lazy" (error)="onImgError()">
        <span>{{ product().category.name }}</span>
      </a>
      <div class="body">
        <a [routerLink]="['/product', product().slug]"><h3>{{ product().name }}</h3></a>
        <p>{{ product().shortDescription }}</p>
        <div class="ratings"><small>INUTILIDAD</small><i><b [style.width.%]="product().uselessnessLevel * 10"></b></i><small>IMPRESIÓN</small><i><b [style.width.%]="product().impressProbability * 10"></b></i></div>
        <div class="foot"><div><strong>{{ product().price | currency:'USD' }}</strong>@if (product().compareAtPrice) { <del>{{ product().compareAtPrice | currency:'USD' }}</del> }</div>
          <button aria-label="Añadir al carrito" (click)="cart.add(product())" [disabled]="product().stock === 0"><i class="fa-solid fa-flask"></i></button>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host{display:block;min-width:0}
    .card{height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);transition:transform .2s,box-shadow .2s}
    .card:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 16px 38px #0005;border-color:color-mix(in srgb,var(--accent) 38%,var(--border))}
    .visual{height:190px;display:block;position:relative;background:var(--bg-surface);overflow:hidden;flex-shrink:0}
    .visual img{width:100%;height:100%;object-fit:cover;transition:opacity .3s}
    .visual span{position:absolute;left:10px;top:10px;background:#0c0c14dd;color:var(--accent);border:1px solid #00e68a55;border-radius:20px;padding:4px 9px;font:600 .65rem "JetBrains Mono";white-space:nowrap;max-width:calc(100% - 20px);overflow:hidden;text-overflow:ellipsis}
    .body{padding:16px;flex:1;display:flex;flex-direction:column;min-width:0}
    .body h3{font-size:1.1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .body p{color:var(--text-muted);font-size:.86rem;height:42px;margin:8px 0 14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
    .ratings{display:grid;grid-template-columns:68px 1fr;gap:5px;align-items:center}
    .ratings small{font:600 .57rem "JetBrains Mono";color:var(--text-muted)}
    .ratings i{height:5px;background:var(--bg-surface);border-radius:8px;overflow:hidden}
    .ratings b{display:block;height:100%;background:var(--accent);border-radius:8px}
    .foot{display:flex;align-items:end;justify-content:space-between;margin-top:auto;padding-top:15px}
    .foot strong{display:block;color:var(--accent);font:700 1rem "JetBrains Mono"}
    .foot del{font-size:.7rem;color:var(--text-muted)}
    button{border:0;border-radius:8px;width:38px;height:38px;background:var(--accent);color:#07120d;flex-shrink:0;transition:.15s}
    button:hover:not(:disabled){transform:scale(1.08)}
    button:disabled{opacity:.35}
    @media(max-width:576px){.visual{height:130px}.body{padding:11px}.body p,.ratings{display:none}.body h3{font-size:.9rem}.foot{padding-top:10px}}
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly cart = inject(CartService);
  private readonly originalImage = computed(() => primaryImage(this.product()));
  private readonly broken = signal(false);
  readonly imgSrc = computed(() => this.broken() ? FALLBACK : this.originalImage());
  onImgError(): void { this.broken.set(true); }
}
