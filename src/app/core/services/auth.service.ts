import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

interface AuthResponse { accessToken: string; refreshToken: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly userKey = 'requena-labs-user';
  readonly currentUser = signal<User | null>(JSON.parse(localStorage.getItem(this.userKey) || 'null'));
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  get accessToken() { return localStorage.getItem('requena-labs-access'); }
  get refreshToken() { return localStorage.getItem('requena-labs-refresh'); }

  login(credentials: { email: string; password: string }) {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(tap(response => this.store(response)));
  }
  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(tap(response => this.store(response)));
  }
  me() {
    return this.api.get<User>('/auth/me').pipe(tap(user => this.currentUser.set(user)));
  }
  tryRefresh() {
    return this.api.post<AuthResponse>('/auth/refresh', { refreshToken: this.refreshToken })
      .pipe(tap(response => this.store(response)));
  }
  logout(): void {
    localStorage.removeItem('requena-labs-access');
    localStorage.removeItem('requena-labs-refresh');
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }
  private store(response: AuthResponse): void {
    localStorage.setItem('requena-labs-access', response.accessToken);
    localStorage.setItem('requena-labs-refresh', response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }
}
