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

  isMenuOpen = false;

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

    // Avoid a stuck-open menu after resizing back to desktop.
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.updateStickyState();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isBrowser || !this.isMenuOpen) {
      return;
    }

    const target = event.target as HTMLElement;
    const navLinks = document.querySelector<HTMLElement>('.nav-links');
    const menuToggle = document.querySelector<HTMLElement>('.menu-toggle');

    if (!navLinks || !menuToggle) {
      return;
    }

    if (!navLinks.contains(target) && !menuToggle.contains(target)) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
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
