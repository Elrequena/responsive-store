import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe],
  template: `
    <div class="shell"><aside><a class="brand" routerLink="/"><i class="fa-solid fa-flask-vial"></i><span>REQUENA LABS<small>CONTROL</small></span></a><nav>
      @for(item of items;track item.path){<a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"><i [class]="item.icon"></i><span>{{item.label|transloco}}</span></a>}
    </nav><a class="back" routerLink="/"><i class="fa-solid fa-arrow-left"></i> Volver a tienda</a></aside><main><header><div><p class="eyebrow">TERMINAL ADMINISTRATIVA</p><b>SISTEMA OPERATIVO</b></div><span><i class="fa-solid fa-circle"></i> API CONECTADA</span></header><router-outlet /></main></div>
  `,
  styles: `
    .shell{min-height:100vh;display:grid;grid-template-columns:240px 1fr}
    .shell>*{min-width:0}
    aside{position:fixed;inset:0 auto 0 0;width:240px;background:var(--bg-card);border-right:1px solid var(--border);padding:24px 14px;display:flex;flex-direction:column;overflow-y:auto}
    .brand{display:flex;gap:10px;align-items:center;padding:8px 10px;font:700 .85rem "Space Grotesk";letter-spacing:.08em;flex-shrink:0}
    .brand i{color:var(--accent);font-size:1.5rem}
    .brand small{display:block;color:var(--accent);font:700 .55rem "JetBrains Mono"}
    nav{display:grid;gap:5px;margin-top:35px}
    nav a{display:flex;gap:12px;align-items:center;padding:10px 12px;color:var(--text-muted);border-radius:6px;font-size:.85rem;transition:.15s}
    nav a.active,nav a:hover{background:var(--bg-surface);color:var(--accent)}
    nav i{width:18px}
    .back{margin-top:auto;color:var(--text-muted);padding:10px;font-size:.8rem;transition:color .15s;flex-shrink:0}
    .back:hover{color:var(--accent)}
    main{grid-column:2;overflow-x:hidden}
    header{height:72px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px}
    header b{font:700 .85rem "Space Grotesk"}
    header .eyebrow{font-size:.55rem;margin:0}
    header span{color:var(--success);font:600 .6rem "JetBrains Mono"}
    header span i{font-size:.5rem}
    @media(max-width:700px){.shell{grid-template-columns:64px 1fr}aside{width:64px;padding:16px 7px}.brand span,nav span,.back{display:none}.brand{justify-content:center}nav a{justify-content:center}.brand i{font-size:1.3rem}header{padding:0 14px}}
  `,
})
export class AdminLayout {
  readonly items = [
    {path:'/admin',label:'admin.dashboard',icon:'fa-solid fa-chart-line'},{path:'/admin/products',label:'admin.products',icon:'fa-solid fa-box'},
    {path:'/admin/categories',label:'admin.categories',icon:'fa-solid fa-tags'},{path:'/admin/orders',label:'admin.orders',icon:'fa-solid fa-receipt'},
    {path:'/admin/users',label:'admin.users',icon:'fa-solid fa-users'},{path:'/admin/inventory',label:'admin.inventory',icon:'fa-solid fa-warehouse'},
    {path:'/admin/coupons',label:'admin.coupons',icon:'fa-solid fa-ticket'}
  ];
}
