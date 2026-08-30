import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Category } from '../../core/models/category.model';
import { Product, Tag } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, TranslocoPipe, ProductCard],
  template: `
    <section class="page container"><p class="eyebrow">INVENTARIO / ACTIVO</p><h1>{{'catalog.title'|transloco}}</h1><div class="mobile-filter"><button class="btn btn-ghost" (click)="filtersOpen.set(!filtersOpen())"><i class="fa-solid fa-sliders"></i> {{'catalog.filters'|transloco}}</button></div>
      <div class="layout">
        <aside class="panel" [class.open]="filtersOpen()">
          <div class="field"><label>{{'nav.search'|transloco}}</label><input [(ngModel)]="query['search']" (keyup.enter)="apply()"></div>
          <div class="field"><label>{{'catalog.category'|transloco}}</label><select [(ngModel)]="query['category']" (change)="apply()"><option value="">Todas</option>@for(c of categories();track c.categoryId){<option [value]="c.slug">{{c.name}}</option>}</select></div>
          <div class="two"><div class="field"><label>Mín.</label><input type="number" [(ngModel)]="query['minPrice']" (change)="apply()"></div><div class="field"><label>Máx.</label><input type="number" [(ngModel)]="query['maxPrice']" (change)="apply()"></div></div>
          <label class="check"><input type="checkbox" [(ngModel)]="query['inStock']" (change)="apply()"> {{'catalog.stock'|transloco}}</label>
          <div class="field"><label>{{'catalog.tags'|transloco}}</label><select [(ngModel)]="query['tag']" (change)="apply()"><option value="">Todas</option>@for(tag of tags();track tag.tagId){<option [value]="tag.slug">{{tag.name}}</option>}</select></div>
          <button class="btn btn-ghost" (click)="clear()">{{'catalog.clear'|transloco}}</button>
        </aside>
        <div><div class="toolbar"><span>{{meta().total}} hallazgos</span><select [(ngModel)]="sort" (change)="applySort()"><option value="createdAt-desc">{{'catalog.newest'|transloco}}</option><option value="price-asc">Precio ↑</option><option value="price-desc">Precio ↓</option><option value="name-asc">Nombre</option><option value="popular-desc">{{'catalog.popular'|transloco}}</option></select></div>
          @if(loading()){<div class="loading"><div class="spinner"></div></div>}@else if(products().length){<div class="grid">@for(product of products();track product.productId){<app-product-card [product]="product" />}</div><div class="pagination"><button [disabled]="meta().page<=1" (click)="page(meta().page-1)">←</button><span>{{meta().page}} / {{meta().totalPages}}</span><button [disabled]="meta().page>=meta().totalPages" (click)="page(meta().page+1)">→</button></div>}@else{<div class="empty"><i class="fa-solid fa-satellite-dish"></i><p>{{'catalog.empty'|transloco}}</p></div>}
        </div>
      </div>
    </section>
  `,
  styles: `
    h1{font-size:clamp(2.4rem,5vw,4rem);margin:12px 0 35px}
    .layout{display:grid;grid-template-columns:250px 1fr;gap:28px;align-items:start}
    .layout>*{min-width:0}
    aside{display:grid;gap:18px;position:sticky;top:92px;overflow:hidden}
    aside select,aside input:not([type="checkbox"]){width:100%;min-width:0}
    .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .check{display:flex;gap:8px;align-items:center;font-size:.85rem}
    .check input[type="checkbox"]{width:auto;min-width:auto;flex-shrink:0}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;color:var(--text-muted);font:600 .75rem "JetBrains Mono"}
    .toolbar select{width:auto;max-width:180px}
    .pagination{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:35px}
    .pagination button{border:1px solid var(--border);background:var(--bg-card);color:var(--text);border-radius:6px;padding:8px 13px;transition:.15s}
    .pagination button:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
    .mobile-filter{display:none}
    @media(max-width:760px){.layout{grid-template-columns:1fr}.mobile-filter{display:block;margin-bottom:15px}aside{display:none;position:static;overflow:visible}aside.open{display:grid}.toolbar{margin-top:10px}}
  `,
})
export class Catalog {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly tags = signal<Tag[]>([]);
  readonly loading = signal(true);
  readonly filtersOpen = signal(false);
  readonly meta = signal({ total: 0, page: 1, limit: 12, totalPages: 1 });
  query: Record<string, any> = { page: 1, limit: 12, search: '', category: '', minPrice: '', maxPrice: '', inStock: false, tag: '' };
  sort = 'createdAt-desc';
  constructor() {
    this.productsService.categories().subscribe(v => this.categories.set(v));
    this.productsService.tags().subscribe(v => this.tags.set(v));
    this.route.queryParams.subscribe(params => { this.query = { ...this.query, ...params, search: params['q'] || params['search'] || '' }; this.sort = `${params['sortBy'] || 'createdAt'}-${params['sortOrder'] || 'desc'}`; this.load(); });
  }
  apply(): void { void this.router.navigate([], { queryParams: { ...this.query, q: null, page: 1 }, queryParamsHandling: 'merge' }); }
  applySort(): void { const [sortBy, sortOrder] = this.sort.split('-'); void this.router.navigate([], { queryParams: { sortBy, sortOrder, page: 1 }, queryParamsHandling: 'merge' }); }
  page(page: number): void { void this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' }); }
  clear(): void { void this.router.navigate([], { queryParams: {} }); }
  private load(): void {
    this.loading.set(true);
    const params = { ...this.query, search: this.query['search'], sortBy: this.sort.split('-')[0], sortOrder: this.sort.split('-')[1] as 'asc' | 'desc' };
    this.productsService.list(params).subscribe({ next: result => { this.products.set(result.data); this.meta.set(result.meta); }, complete: () => this.loading.set(false), error: () => this.loading.set(false) });
  }
}
