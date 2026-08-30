import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly key = 'requena-labs-lang';
  readonly language = signal(localStorage.getItem(this.key) || 'es');
  constructor() { this.transloco.setActiveLang(this.language()); }
  toggle(): void { this.set(this.language() === 'es' ? 'en' : 'es'); }
  set(lang: string): void {
    this.language.set(lang);
    localStorage.setItem(this.key, lang);
    this.transloco.setActiveLang(lang);
  }
}
