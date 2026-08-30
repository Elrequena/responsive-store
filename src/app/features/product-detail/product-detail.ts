import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Product, primaryImage } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, TranslocoPipe, ProductCard],
  template: `
    <section class="page container">
      @if(product();as p){<div class="detail"><div><div class="main-image"><img [src]="selectedImage() || image(p)" [alt]="p.name"></div><div class="thumbs">@for(imageItem of p.images;track imageItem.url){<button (click)="selectedImage.set(imageItem.url)"><img [src]="imageItem.url" [alt]="imageItem.altText || p.name"></button>}</div></div>
        <div class="info"><p class="eyebrow">{{p.category.name}}</p><h1>{{p.name}}</h1><p class="description">{{p.description}}</p><div class="pricing"><b>{{p.price|currency:'USD'}}</b>@if(p.compareAtPrice){<del>{{p.compareAtPrice|currency:'USD'}}</del>}</div>
          @if(p.stock>0){<p class="stock ok"><i class="fa-solid fa-circle"></i> {{'product.stock'|transloco:{count:p.stock} }}</p>}@else{<p class="stock out">{{'product.out'|transloco}}</p>}
          <div class="bars">@for(item of attributes(p);track item.label){<div><span>{{item.label}}</span><i><b [style.width.%]="item.value*10"></b></i><code>{{item.value}}/10</code></div>}</div>
          <button class="btn btn-primary buy" [disabled]="p.stock===0" (click)="cart.add(p)"><i class="fa-solid fa-cart-plus"></i>{{'product.add'|transloco}}</button>
        </div>
      </div><div class="related"><h2>{{'product.related'|transloco}}</h2><div class="grid">@for(item of related();track item.productId){<app-product-card [product]="item" />}</div></div>}@else{<div class="loading"><div class="spinner"></div></div>}
    </section>
  `,
  styles: `
    .detail{display:grid;grid-template-columns:1fr 1fr;gap:55px;align-items:start}
    .detail>*{min-width:0}
    .main-image{height:470px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;overflow:hidden}
    .main-image img{width:100%;height:100%;object-fit:cover}
    .thumbs{display:flex;gap:9px;margin-top:10px;overflow-x:auto}
    .thumbs button{width:68px;height:58px;padding:0;border:1px solid var(--border);background:var(--bg-card);border-radius:6px;overflow:hidden;flex-shrink:0;transition:border-color .15s}
    .thumbs button:hover{border-color:var(--accent)}
    .thumbs img{width:100%;height:100%;object-fit:cover}
    .info h1{font-size:clamp(2.4rem,5vw,4.6rem);margin:12px 0 20px}
    .description{color:var(--text-muted);font-size:1.05rem;line-height:1.6}
    .pricing{display:flex;gap:14px;align-items:center;margin:28px 0 12px;flex-wrap:wrap}
    .pricing b{color:var(--accent);font:700 2rem "JetBrains Mono"}
    .pricing del{color:var(--text-muted)}
    .stock{font:600 .8rem "JetBrains Mono"}
    .stock.ok{color:var(--success)}.stock.ok i{font-size:.55rem}
    .stock.out{color:var(--danger)}
    .bars{display:grid;gap:14px;margin:30px 0}
    .bars>div{display:grid;grid-template-columns:180px 1fr 42px;align-items:center;gap:12px}
    .bars span,.bars code{font-size:.7rem;color:var(--text-muted)}
    .bars i{height:7px;background:var(--bg-surface);border-radius:10px;overflow:hidden}
    .bars b{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:10px}
    .buy{width:100%;margin-top:8px}.buy:disabled{opacity:.4}
    .related{margin-top:80px}.related h2{margin-bottom:22px}
    @media(max-width:760px){.detail{grid-template-columns:1fr;gap:28px}.main-image{height:330px}.bars>div{grid-template-columns:130px 1fr 35px}}
  `,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductsService);
  readonly cart = inject(CartService);
  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly selectedImage = signal('');
  constructor() {
    this.route.paramMap.subscribe(params => this.products.getBySlug(params.get('slug')!).subscribe(product => {
      this.product.set(product);
      this.selectedImage.set(primaryImage(product));
      this.related.set((product.related ?? []).filter(item => item.productId !== product.productId).slice(0, 4));
    }));
  }
  image(product: Product) { return primaryImage(product); }
  attributes(p: Product) { return [{label:'Inutilidad',value:p.uselessnessLevel},{label:'Riesgo de arrepentimiento',value:p.regretRisk},{label:'Utilidad cuestionable',value:p.questionableUtility},{label:'Prob. de impresionar',value:p.impressProbability}]; }
}
