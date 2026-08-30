import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink, TranslocoPipe],
  template: `
    <section class="page auth"><div class="panel"><div class="mark"><i class="fa-solid fa-flask-vial"></i><p class="eyebrow">ACCESO AL LABORATORIO</p></div><h1>{{isRegister() ? ('auth.register'|transloco) : ('auth.login'|transloco)}}</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if(isRegister()){<div class="row"><label class="field"><span>{{'auth.firstName'|transloco}}</span><input formControlName="firstName"></label><label class="field"><span>{{'auth.lastName'|transloco}}</span><input formControlName="lastName"></label></div>}
        <label class="field"><span>{{'auth.email'|transloco}}</span><input type="email" formControlName="email"></label><label class="field"><span>{{'auth.password'|transloco}}</span><input type="password" formControlName="password"></label>
        <button class="btn btn-primary" [disabled]="form.invalid||loading()">{{loading()?'Procesando…':('auth.submit'|transloco)}}</button>
      </form>@if(error()){<p class="error">{{error()}}</p>}<a [routerLink]="isRegister()?'/auth/login':'/auth/register'">{{isRegister()?'Ya tengo credencial':'Crear una credencial nueva'}} →</a>
    </div></section>
  `,
  styles: `
    .auth{display:grid;place-items:center}.panel{width:min(470px,calc(100% - 24px));padding:34px}.mark{display:flex;align-items:center;gap:10px}.mark i{color:var(--accent);font-size:1.6rem}h1{font-size:2.2rem;margin:16px 0 24px}form{display:grid;gap:16px}.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.btn{margin-top:5px}.panel>a{display:block;text-align:center;color:var(--accent);font-size:.85rem;margin-top:20px}.error{color:var(--danger);font-size:.85rem}@media(max-width:576px){.row{grid-template-columns:1fr}}
  `,
})
export class Auth {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly isRegister = signal(this.router.url.includes('register'));
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]], firstName: [''], lastName: [''] });
  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true); const v = this.form.getRawValue();
    const request = this.isRegister() ? this.auth.register(v) : this.auth.login(v);
    request.subscribe({next:async()=>{await this.cart.mergeOnLogin();void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl')||'/')},error:e=>{this.error.set(e.error?.message||'No se pudo abrir la compuerta.');this.loading.set(false)}});
  }
}
