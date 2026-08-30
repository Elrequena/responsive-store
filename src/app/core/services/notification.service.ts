import { Injectable, signal } from '@angular/core';

export interface ToastMessage { id: number; type: 'success' | 'error' | 'info'; message: string; }

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly toasts = signal<ToastMessage[]>([]);
  private id = 0;
  show(message: string, type: ToastMessage['type'] = 'info'): void {
    const id = ++this.id;
    this.toasts.update(items => [...items, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 3800);
  }
  dismiss(id: number): void { this.toasts.update(items => items.filter(item => item.id !== id)); }
}
