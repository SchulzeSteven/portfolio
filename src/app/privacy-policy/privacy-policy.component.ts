import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [NavbarComponent, RouterLink, TranslatePipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacypolicyComponent implements OnInit, OnDestroy {
  /** Reference to the scrollable privacy policy text element */
  @ViewChild('privacyText') privacyTextRef!: ElementRef<HTMLDivElement>;

  /** Scroll speed in pixels per frame */
  private scrollSpeed = 1.2;

  /** Width used to calculate when to reset the scroll animation */
  private containerWidth = 120;

  /** Current scroll position (used for animation offset) */
  private scrollPos = 0;

  /** ID of the current animation frame for scroll animation */
  private frameId: number | null = null;

  /**
   * Called when the component is initialized.
   * Scrolls to top and sets a custom background.
   */
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.backgroundImage = 'linear-gradient(to top right, #1c1c1c 70%, #08463b)';
  }

  /**
   * Called when the component is destroyed.
   * Cleans up styles and cancels ongoing animations.
   */
  ngOnDestroy(): void {
    document.body.style.backgroundImage = '';
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  /**
   * Starts the horizontal scroll animation for the text.
   */
  startScroll(): void {
    const el = this.privacyTextRef.nativeElement;
    this.scrollPos = 0;
    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() =>
        this.scrollStep(el)
      );
    }
  }

  /**
   * Performs one step of the scroll animation.
   * Loops the text when it scrolls out of view.
   * 
   * @param el HTML element to animate
   */
  private scrollStep(el: HTMLElement): void {
    this.scrollPos -= this.scrollSpeed;
    el.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    const textWidth = el.offsetWidth;
    if (this.scrollPos + textWidth < -this.containerWidth / 2) {
      this.scrollPos = this.containerWidth + textWidth;
    }

    this.frameId = requestAnimationFrame(() =>
      this.scrollStep(el)
    );
  }

  /**
   * Stops the scroll animation and resets the text position smoothly.
   */
  stopScroll(): void {
    const textEl = this.privacyTextRef.nativeElement;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    this.scrollPos = 0;
  }
}