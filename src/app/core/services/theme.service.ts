import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly key = 'requena-labs-theme';
  readonly theme = signal<Theme>((localStorage.getItem(this.key) as Theme) || 'dark');

  constructor() { this.apply(this.theme()); }

  toggle(): void { this.set(this.theme() === 'dark' ? 'light' : 'dark'); }
  set(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.key, theme);
    this.apply(theme);
  }
  private apply(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
  }
}
