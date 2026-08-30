import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {
  private readonly auth = inject(AuthService);
  constructor() {
    if (this.auth.accessToken) this.auth.me().subscribe({ error: () => this.auth.logout() });
  }
}
