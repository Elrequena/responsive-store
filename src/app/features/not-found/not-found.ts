import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslocoPipe],
  template: `
    <section class="page container error"><code>ERROR_404</code><i class="fa-solid fa-ghost"></i><h1>{{'errors.404'|transloco}}</h1><p>El prototipo solicitado escapó, explotó o nunca fue aprobado por el comité.</p><a class="btn btn-primary" routerLink="/">{{'errors.back'|transloco}}</a></section>
  `,
  styles: `.error{text-align:center;display:grid;place-items:center;align-content:center;gap:18px}.error code{color:var(--danger);font:700 .8rem "JetBrains Mono"}.error>i{font-size:5rem;color:var(--accent)}h1{font-size:clamp(2.5rem,6vw,5rem)}p{color:var(--text-muted)}`,
})
export class NotFound {

}
