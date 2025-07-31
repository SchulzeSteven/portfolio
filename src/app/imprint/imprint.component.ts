import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [NavbarComponent, RouterLink, TranslatePipe],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent implements OnInit, OnDestroy {
  /** Reference to the scrolling text container element */
  @ViewChild('imprintText') imprintTextRef!: ElementRef<HTMLDivElement>;

  /** Speed of the scroll animation */
  private scrollSpeed = 1.2;

  /** Width of the scroll container for reset calculation */
  private containerWidth = 120;

  /** Current scroll position */
  private scrollPos = 0;

  /** Animation frame ID to manage requestAnimationFrame lifecycle */
  private frameId: number | null = null;

  /**
   * Lifecycle hook that runs when the component is initialized.
   * Scrolls to the top and sets a custom background gradient.
   */
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.backgroundImage = 'linear-gradient(to top right, #1c1c1c 70%, #08463b)';
  }

  /**
   * Lifecycle hook that runs when the component is destroyed.
   * Cleans up background and scroll animation.
   */
  ngOnDestroy(): void {
    document.body.style.backgroundImage = '';
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  /**
   * Starts the continuous horizontal scroll animation
   * for the imprint text element.
   */
  startScroll(): void {
    const el = this.imprintTextRef?.nativeElement;
    if (!el) return;

    this.scrollPos = 0;
    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => this.scrollStep(el));
    }
  }

  /**
   * Executes one step of the scrolling animation.
   * Resets the position when the text moves out of view.
   * @param el HTML element to animate
   */
  private scrollStep(el: HTMLElement): void {
    this.scrollPos -= this.scrollSpeed;
    el.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    if (this.scrollPos + el.offsetWidth < -this.containerWidth / 2) {
      this.scrollPos = this.containerWidth + el.offsetWidth;
    }

    this.frameId = requestAnimationFrame(() => this.scrollStep(el));
  }

  /**
   * Stops the scroll animation and resets the element position smoothly.
   */
  stopScroll(): void {
    const textEl = this.imprintTextRef.nativeElement;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;

    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    this.scrollPos = 0;
  }
}