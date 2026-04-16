import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.css'
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLDivElement>;

  private rafId = 0;
  private removeMouseMove?: () => void;
  private removeMouseEnter?: () => void;
  private removeMouseLeave?: () => void;
  private removeMouseDown?: () => void;
  private removeMouseUp?: () => void;
  private removeHoverIn?: () => void;
  private removeHoverOut?: () => void;

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private isVisible = false;
  private isPressed = false;
  private isHoverTarget = false;

  constructor(
    private renderer: Renderer2,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      const dot = this.dotRef.nativeElement;
      const ring = this.ringRef.nativeElement;

      this.removeMouseMove = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (!this.isVisible) {
          this.isVisible = true;
          dot.classList.add('visible');
          ring.classList.add('visible');
        }
      });

      this.removeMouseEnter = this.renderer.listen('document', 'mouseenter', () => {
        dot.classList.add('visible');
        ring.classList.add('visible');
      });

      this.removeMouseLeave = this.renderer.listen('document', 'mouseleave', () => {
        dot.classList.remove('visible');
        ring.classList.remove('visible');
      });

      this.removeMouseDown = this.renderer.listen('document', 'mousedown', () => {
        this.isPressed = true;
      });

      this.removeMouseUp = this.renderer.listen('document', 'mouseup', () => {
        this.isPressed = false;
      });

      this.removeHoverIn = this.renderer.listen('document', 'mouseover', (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        this.isHoverTarget = !!target?.closest('a, button, input, textarea, select, [role="button"]');
      });

      this.removeHoverOut = this.renderer.listen('document', 'mouseout', (event: MouseEvent) => {
        const next = event.relatedTarget as HTMLElement | null;
        this.isHoverTarget = !!next?.closest('a, button, input, textarea, select, [role="button"]');
      });

      this.ringX = this.mouseX;
      this.ringY = this.mouseY;
      this.animate();
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.removeMouseMove?.();
    this.removeMouseEnter?.();
    this.removeMouseLeave?.();
    this.removeMouseDown?.();
    this.removeMouseUp?.();
    this.removeHoverIn?.();
    this.removeHoverOut?.();
  }

  private animate(): void {
    const dot = this.dotRef.nativeElement;
    const ring = this.ringRef.nativeElement;

    this.ringX += (this.mouseX - this.ringX) * 0.17;
    this.ringY += (this.mouseY - this.ringY) * 0.17;

    const dotScale = this.isPressed ? 0.7 : 1;
    const ringScale = this.isPressed ? 0.9 : this.isHoverTarget ? 1.55 : 1;

    dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
    ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}
