import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  private topBarOriginalPosition = 0;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.calculateTopBarPosition();
    this.updateStickyState();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) {
      return;
    }

    this.calculateTopBarPosition();
    this.updateStickyState();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateStickyState();
  }

  private calculateTopBarPosition(): void {
    if (!this.isBrowser) {
      return;
    }

    const topBar = document.getElementById('top-bar');
    const heroElement = document.querySelector<HTMLElement>('.your-hero-element');

    if (!topBar) {
      return;
    }

    if (heroElement) {
      this.topBarOriginalPosition =
        heroElement.offsetTop + heroElement.offsetHeight - topBar.offsetHeight;
      return;
    }

    this.topBarOriginalPosition = topBar.offsetTop;
  }

  private updateStickyState(): void {
    if (!this.isBrowser) {
      return;
    }

    const topBar = document.getElementById('top-bar');
    if (!topBar) {
      return;
    }

    if (window.scrollY > this.topBarOriginalPosition) {
      topBar.classList.add('sticky');
    } else {
      topBar.classList.remove('sticky');
    }
  }
}
