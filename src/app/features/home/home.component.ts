import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslocoPipe, ProductCard],
  template: `
    <section class="hero"><div class="container hero-grid"><div><p class="eyebrow">{{'home.eyebrow'|transloco}}</p><h1>{{'home.tagline'|transloco}}</h1><p class="lead">{{'home.subtitle'|transloco}}</p><a class="btn btn-primary" routerLink="/catalog">{{'home.cta'|transloco}} <i class="fa-solid fa-arrow-right"></i></a></div><div class="machine" aria-hidden="true"><div class="orbit"><i class="fa-solid fa-gear"></i></div><i class="fa-solid fa-flask-vial"></i><code>UTILITY_STATUS: UNVERIFIED<br>ENGINEERING: EXCESSIVE<br>REGRET_RISK: 7.4/10</code></div></div></section>
    <section class="container section"><div class="heading"><p class="eyebrow">SELECCIÓN 01</p><h2>{{'home.featured'|transloco}}</h2></div>
      @if(loading()){<div class="loading"><div class="spinner"></div></div>}@else{<div class="grid">@for(product of featured();track product.productId){<app-product-card [product]="product" />}</div>}
    </section>
    <section class="categories"><div class="container section"><div class="heading"><p class="eyebrow">ARCHIVO 02</p><h2>{{'home.categories'|transloco}}</h2></div><div class="cat-grid">@for(category of categories();track category.categoryId){<a [routerLink]="['/catalog']" [queryParams]="{category:category.slug}"><i class="fa-solid fa-atom"></i><h3>{{category.name}}</h3><p>{{category.description}}</p><span>EXPLORAR →</span></a>}</div></div></section>
  `,
  styles: [`
    .hero{min-height:620px;display:grid;align-items:center;overflow:hidden;background-image:linear-gradient(#00e68a08 1px,transparent 1px),linear-gradient(90deg,#00e68a08 1px,transparent 1px);background-size:42px 42px}
    .hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;align-items:center}
    .hero-grid>*{min-width:0}
    .hero h1{font-size:clamp(2.8rem,6vw,5.6rem);max-width:900px;margin:18px 0 24px;letter-spacing:-.055em}
    .lead{max-width:660px;color:var(--text-muted);font-size:1.1rem;margin-bottom:30px}
    .machine{height:390px;border:1px solid var(--border);background:var(--bg-card);border-radius:50% 8px 50% 8px;display:grid;place-items:center;position:relative;box-shadow:inset 0 0 80px #00e68a09;overflow:hidden}
    .machine>i{font-size:7rem;color:var(--accent);filter:drop-shadow(0 0 26px #00e68a66)}
    .machine code{position:absolute;bottom:28px;left:28px;font-size:.65rem;color:var(--text-muted)}
    .orbit{position:absolute;inset:35px;border:1px dashed var(--accent);border-radius:50%;animation:spin 18s linear infinite}
    .orbit i{position:absolute;top:-12px;left:50%;font-size:1.5rem;color:var(--accent-2)}
    .section{padding:75px 0}.heading{margin-bottom:28px}.heading h2{font-size:2rem;margin-top:8px}
    .categories{background:var(--bg-card);border-block:1px solid var(--border)}
    .cat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
    .cat-grid a{background:var(--bg);border:1px solid var(--border);padding:24px;border-radius:8px;transition:border-color .15s,transform .15s}
    .cat-grid a:hover{border-color:var(--accent);transform:translateY(-2px)}
    .cat-grid i,.cat-grid span{color:var(--accent)}
    .cat-grid h3{margin:18px 0 7px}
    .cat-grid p{color:var(--text-muted);font-size:.85rem;min-height:42px}
    .cat-grid span{display:block;margin-top:18px;font:700 .65rem "JetBrains Mono"}
    @media(max-width:800px){.hero{min-height:540px}.hero-grid{grid-template-columns:1fr}.machine{display:none}}
    @media(max-width:576px){.hero h1{font-size:2.7rem}.section{padding:48px 0}}
  `]
})
export class HomeComponent {
  private readonly products = inject(ProductsService);
  readonly featured = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  constructor() {
    this.products.list({ featured: true, limit: 4 }).subscribe({ next: r => this.featured.set(r.data), complete: () => this.loading.set(false), error: () => this.loading.set(false) });
    this.products.categories().subscribe(categories => this.categories.set(categories));
  }
}
