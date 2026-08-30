import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminCoupon, AdminService } from '../../core/services/admin.service';
import { Product, Tag } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Order, OrderStatus } from '../../core/models/order.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CurrencyPipe, DatePipe],
  template: `
    <section class="admin-page">
      <div class="title">
        <div><p class="eyebrow">MÓDULO / {{section().toUpperCase()}}</p><h1>{{titles[section()]}}</h1></div>
        @if (section()==='products' || section()==='categories' || section()==='coupons') {
          <button class="btn btn-primary" (click)="startCreate()"><i class="fa-solid fa-plus"></i> Nuevo</button>
        }
      </div>
      @switch (section()) {
        @case ('dashboard') {
          <div class="metrics">
            <article><i class="fa-solid fa-box"></i><span>Productos</span><b>{{products().length}}</b></article>
            <article><i class="fa-solid fa-receipt"></i><span>Órdenes</span><b>{{orders().length}}</b></article>
            <article><i class="fa-solid fa-users"></i><span>Usuarios</span><b>{{users().length}}</b></article>
            <article><i class="fa-solid fa-triangle-exclamation"></i><span>Stock crítico</span><b>{{lowStock().length}}</b></article>
          </div>
          <div class="panel"><h2>Alertas de inventario</h2>
            @for (p of lowStock(); track p.productId) {
              <div class="alert"><span>{{p.name}}</span><b [class.out]="p.stock===0">{{p.stock}} unidades</b></div>
            }
          </div>
        }
        @case ('products') {
          @if (editing()) {
            <form class="panel form" (submit)="saveProduct($event)">
              <h2>Ficha del artefacto</h2>
              <input [(ngModel)]="draft.name" name="name" placeholder="Nombre" required>
              <textarea [(ngModel)]="draft.shortDescription" name="short" placeholder="Descripción corta"></textarea>
              <textarea [(ngModel)]="draft.description" name="description" placeholder="Descripción"></textarea>
              <input type="number" [(ngModel)]="draft.price" name="price" placeholder="Precio">
              <input type="number" [(ngModel)]="draft.compareAtPrice" name="compare" placeholder="Precio anterior">
              <input type="number" [(ngModel)]="draft.stock" name="stock" placeholder="Stock">
              <input [(ngModel)]="images" name="images" placeholder="URLs de imágenes, separadas por coma">
              <select [(ngModel)]="categoryId" name="category">
                @for (c of categories(); track c.categoryId) { <option [ngValue]="c.categoryId">{{c.name}}</option> }
              </select>
              <label>Inutilidad <input type="range" min="1" max="10" [(ngModel)]="draft.uselessnessLevel" name="useless"></label>
              <label>Arrepentimiento <input type="range" min="1" max="10" [(ngModel)]="draft.regretRisk" name="regret"></label>
              <label>Utilidad cuestionable <input type="range" min="1" max="10" [(ngModel)]="draft.questionableUtility" name="utility"></label>
              <label>Prob. impresionar <input type="range" min="1" max="10" [(ngModel)]="draft.impressProbability" name="impress"></label>
              <label><input type="checkbox" [(ngModel)]="draft.isFeatured" name="featured"> Destacado</label>
              <div><button class="btn btn-primary">Guardar</button><button type="button" class="btn btn-ghost" (click)="editing.set(false)">Cancelar</button></div>
            </form>
          }
          <div class="panel table"><table><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Destacado</th><th></th></tr></thead>
            <tbody>@for (p of products(); track p.productId) {
              <tr><td><b>{{p.name}}</b><small>{{p.category.name}}</small></td><td>{{p.price|currency:'USD'}}</td><td [class.danger]="p.stock===0">{{p.stock}}</td><td>{{p.isFeatured?'Sí':'No'}}</td>
              <td><button (click)="editProduct(p)"><i class="fa-solid fa-pen"></i></button><button (click)="deleteProduct(p.productId)"><i class="fa-solid fa-trash"></i></button></td></tr>
            }</tbody>
          </table></div>
        }
        @case ('categories') {
          @if (editing()) {
            <form class="panel form" (submit)="saveCategory($event)">
              <h2>Categoría</h2>
              <input [(ngModel)]="categoryDraft.name" name="cname" placeholder="Nombre" required>
              <input [(ngModel)]="categoryDraft.description" name="cdesc" placeholder="Descripción">
              <input [(ngModel)]="categoryDraft.imageUrl" name="cimage" placeholder="URL de imagen">
              <input type="number" [(ngModel)]="categoryDraft.displayOrder" name="corder" placeholder="Orden">
              <div><button class="btn btn-primary">Guardar</button><button type="button" class="btn btn-ghost" (click)="editing.set(false)">Cancelar</button></div>
            </form>
          }
          <div class="panel table"><table><thead><tr><th>Nombre</th><th>Slug</th><th>Orden</th><th></th></tr></thead>
            <tbody>@for (c of categories(); track c.categoryId) {
              <tr><td>{{c.name}}</td><td>{{c.slug}}</td><td>{{c.displayOrder}}</td>
              <td><button (click)="editCategory(c)"><i class="fa-solid fa-pen"></i></button><button (click)="deleteCategory(c.categoryId)"><i class="fa-solid fa-trash"></i></button></td></tr>
            }</tbody>
          </table></div>
        }
        @case ('coupons') {
          @if (editing()) {
            <form class="panel form" (submit)="saveCoupon($event)">
              <h2>Cupón</h2>
              <input [(ngModel)]="couponDraft.code" name="code" placeholder="CODE" required>
              <select [(ngModel)]="couponDraft.discountType" name="dtype">
                <option value="percentage">Porcentaje</option>
                <option value="fixed_amount">Monto fijo</option>
              </select>
              <input type="number" [(ngModel)]="couponDraft.value" name="cvalue" placeholder="Valor">
              <input type="number" [(ngModel)]="couponDraft.minPurchase" name="cmin" placeholder="Compra mínima">
              <input type="datetime-local" [(ngModel)]="couponDraft.startsAt" name="cstart">
              <input type="datetime-local" [(ngModel)]="couponDraft.expiresAt" name="cexpire">
              <label><input type="checkbox" [(ngModel)]="couponDraft.isActive" name="cactive"> Activo</label>
              <div><button class="btn btn-primary">Guardar</button><button type="button" class="btn btn-ghost" (click)="editing.set(false)">Cancelar</button></div>
            </form>
          }
          <div class="panel table"><table><thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Usos</th><th>Activo</th><th></th></tr></thead>
            <tbody>@for (c of coupons(); track c.couponId) {
              <tr><td>{{c.code}}</td><td>{{c.discountType}}</td><td>{{c.value}}</td><td>{{c.usedCount}} / {{c.maxUses ?? '∞'}}</td><td>{{c.isActive?'Sí':'No'}}</td>
              <td><button (click)="editCoupon(c)"><i class="fa-solid fa-pen"></i></button><button (click)="deleteCoupon(c.couponId)"><i class="fa-solid fa-trash"></i></button></td></tr>
            }</tbody>
          </table></div>
        }
        @case ('orders') {
          <div class="panel table"><table><thead><tr><th>Orden</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>@for (o of orders(); track o.orderId) {
              <tr><td>#{{o.orderNumber}}</td><td>{{o.createdAt|date:'short'}}</td><td>{{o.total|currency:'USD'}}</td>
              <td><select [ngModel]="o.status" (ngModelChange)="status(o,$event)">@for (s of statuses; track s) {<option [value]="s">{{s}}</option>}</select></td></tr>
            }</tbody>
          </table></div>
        }
        @case ('users') {
          <div class="panel table"><table><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th></tr></thead>
            <tbody>@for (u of users(); track u.userId) {
              <tr><td>{{u.firstName}} {{u.lastName}}</td><td>{{u.email}}</td><td>{{u.role}}</td><td>{{u.isActive?'Activo':'Bloqueado'}}</td></tr>
            }</tbody>
          </table></div>
        }
        @case ('inventory') {
          <div class="panel table"><table><thead><tr><th>Producto</th><th>Nivel</th><th>Stock editable</th></tr></thead>
            <tbody>@for (p of inventory(); track p.productId) {
              <tr><td>{{p.name}}</td>
              <td><span class="stock" [class.green]="p.stock>10" [class.yellow]="p.stock>0 && p.stock<=10" [class.red]="p.stock===0">{{p.stock>10?'Sano':p.stock?'Bajo':'Agotado'}}</span></td>
              <td><input class="stock-input" type="number" [ngModel]="p.stock" (change)="updateStock(p,$event)"></td></tr>
            }</tbody>
          </table></div>
        }
      }
    </section>
  `,
  styles: `
    .admin-page{padding:30px;max-width:1400px}.title{display:flex;align-items:end;justify-content:space-between;margin-bottom:26px}.title h1{font-size:2.4rem;margin-top:8px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}.metrics article{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:20px;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}.metrics i{grid-row:1/3;color:var(--accent);font-size:1.4rem}.metrics span{color:var(--text-muted);font-size:.75rem}.metrics b{font:700 1.6rem "JetBrains Mono"}.panel h2{margin-bottom:16px}.alert{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border)}.alert b{color:var(--warning)}.alert b.out{color:var(--danger)}
    .table{overflow:auto;padding:0}table{border-collapse:collapse;width:100%;min-width:650px}th,td{text-align:left;padding:14px 16px;border-bottom:1px solid var(--border)}th{color:var(--text-muted);font:600 .65rem "JetBrains Mono";text-transform:uppercase}td{font-size:.85rem}td small{display:block;color:var(--text-muted)}td button{border:0;background:none;color:var(--text-muted);margin-right:8px}.danger{color:var(--danger)}.stock{padding:4px 9px;border-radius:20px;font:600 .65rem "JetBrains Mono"}.green{color:var(--success);background:#22c55e18}.yellow{color:var(--warning);background:#fbbf2418}.red{color:var(--danger);background:#f43f5e18}.stock-input{width:80px}.form{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}.form h2,.form textarea,.form>div{grid-column:1/-1}.form label{display:grid;color:var(--text-muted);font-size:.75rem}.form textarea{min-height:80px}.form>div{display:flex;gap:8px}@media(max-width:900px){.metrics{grid-template-columns:1fr 1fr}}@media(max-width:576px){.admin-page{padding:18px 12px}.metrics{grid-template-columns:1fr}.form{grid-template-columns:1fr}.form>*{grid-column:1!important}}
  `,
})
export class Admin {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminService);
  readonly section = signal('dashboard');
  readonly editing = signal(false);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly users = signal<User[]>([]);
  readonly inventory = signal<Product[]>([]);
  readonly lowStock = signal<Product[]>([]);
  readonly coupons = signal<AdminCoupon[]>([]);
  readonly tagOptions = signal<Tag[]>([]);
  readonly statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  readonly titles: Record<string, string> = {
    dashboard: 'Panel del laboratorio',
    products: 'Productos',
    categories: 'Categorías',
    orders: 'Órdenes',
    users: 'Usuarios',
    inventory: 'Inventario',
    coupons: 'Cupones',
  };
  draft: Partial<Product> = {};
  categoryDraft: Partial<Category> = {};
  couponDraft: Partial<AdminCoupon> = { discountType: 'percentage', isActive: true };
  images = '';
  categoryId: number | null = null;

  constructor() {
    this.route.data.subscribe((data) => {
      this.section.set((data['section'] as string) || 'dashboard');
      this.editing.set(false);
      this.load();
    });
  }

  startCreate(): void {
    this.draft = { uselessnessLevel: 5, regretRisk: 5, questionableUtility: 5, impressProbability: 5, stock: 0, price: 0 };
    this.categoryDraft = { displayOrder: 0 };
    this.couponDraft = { discountType: 'percentage', isActive: true };
    this.images = '';
    this.categoryId = this.categories()[0]?.categoryId ?? null;
    this.editing.set(true);
  }

  editProduct(product: Product): void {
    this.draft = { ...product };
    this.images = (product.images ?? []).map((img) => img.url).join(', ');
    this.categoryId = product.category?.categoryId ?? null;
    this.editing.set(true);
  }

  saveProduct(event: Event): void {
    event.preventDefault();
    const imageList = this.images.split(',').map((url) => url.trim()).filter(Boolean)
      .map((url, index) => ({ url, displayOrder: index + 1, isPrimary: index === 0 }));
    const payload = {
      name: this.draft.name,
      shortDescription: this.draft.shortDescription,
      description: this.draft.description,
      price: Number(this.draft.price),
      compareAtPrice: this.draft.compareAtPrice ? Number(this.draft.compareAtPrice) : undefined,
      stock: Number(this.draft.stock ?? 0),
      categoryId: Number(this.categoryId),
      uselessnessLevel: Number(this.draft.uselessnessLevel ?? 5),
      regretRisk: Number(this.draft.regretRisk ?? 5),
      questionableUtility: Number(this.draft.questionableUtility ?? 5),
      impressProbability: Number(this.draft.impressProbability ?? 5),
      isFeatured: Boolean(this.draft.isFeatured),
      images: imageList,
    };
    this.api.saveProduct(payload, this.draft.productId).subscribe(() => {
      this.editing.set(false);
      this.draft = {};
      this.load();
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Desmantelar este artefacto?')) this.api.deleteProduct(id).subscribe(() => this.load());
  }

  editCategory(category: Category): void {
    this.categoryDraft = { ...category };
    this.editing.set(true);
  }

  saveCategory(event: Event): void {
    event.preventDefault();
    this.api.saveCategory(this.categoryDraft, this.categoryDraft.categoryId).subscribe(() => {
      this.editing.set(false);
      this.load();
    });
  }

  deleteCategory(id: number): void {
    if (confirm('¿Eliminar esta categoría?')) this.api.deleteCategory(id).subscribe(() => this.load());
  }

  editCoupon(coupon: AdminCoupon): void {
    this.couponDraft = {
      ...coupon,
      startsAt: coupon.startsAt?.slice(0, 16),
      expiresAt: coupon.expiresAt?.slice(0, 16),
    };
    this.editing.set(true);
  }

  saveCoupon(event: Event): void {
    event.preventDefault();
    this.api.saveCoupon({
      ...this.couponDraft,
      startsAt: this.couponDraft.startsAt ? new Date(this.couponDraft.startsAt).toISOString() : undefined,
      expiresAt: this.couponDraft.expiresAt ? new Date(this.couponDraft.expiresAt).toISOString() : undefined,
    }, this.couponDraft.couponId).subscribe(() => {
      this.editing.set(false);
      this.load();
    });
  }

  deleteCoupon(id: number): void {
    if (confirm('¿Eliminar este cupón?')) this.api.deleteCoupon(id).subscribe(() => this.load());
  }

  status(order: Order, status: OrderStatus): void {
    this.api.updateOrder(order.orderId, status).subscribe(() => this.load());
  }

  updateStock(product: Product, event: Event): void {
    const stock = Number((event.target as HTMLInputElement).value);
    this.api.updateStock(product.productId, stock).subscribe(() => this.load());
  }

  private load(): void {
    this.api.products().subscribe((value) => {
      this.products.set(value);
      this.lowStock.set(value.filter((product) => product.stock < 5));
    });
    this.api.categories().subscribe((value) => this.categories.set(value));
    this.api.orders().subscribe((value) => this.orders.set(value));
    this.api.users().subscribe((value) => this.users.set(value));
    this.api.inventory().subscribe((value) => this.inventory.set(value));
    this.api.coupons().subscribe((value) => this.coupons.set(value));
    this.api.tags().subscribe((value) => this.tagOptions.set(value));
    this.api.alerts().subscribe((value) => {
      if (value?.length) this.lowStock.set(value);
    });
  }
}
