import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, OnDestroy, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScreenSizeService implements OnDestroy {
  readonly isMobile = signal(false);
  readonly isDesktop = signal(true);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resizeHandler = () => this.check();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.check();
      window.addEventListener('resize', this.resizeHandler);
    }
  }
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) window.removeEventListener('resize', this.resizeHandler);
  }
  private check(): void {
    const mobile = window.innerWidth < 576;
    this.isMobile.set(mobile);
    this.isDesktop.set(!mobile);
  }
}
