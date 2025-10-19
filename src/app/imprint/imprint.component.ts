import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from "../footer/footer.component";
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [NavbarComponent, RouterLink, TranslatePipe, FooterComponent, SafeHtmlPipe],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent implements OnInit, OnDestroy {
  /**
   * Reference to the scrollable text element for the back button.
   */
  @ViewChild('imprintText') imprintTextRef!: ElementRef<HTMLDivElement>;

  /**
   * Reference to the imprint container element (used to detect backdrop clicks).
   */
  @ViewChild('imprintContainer') imprintContainerRef!: ElementRef<HTMLElement>;

  /** Speed of the horizontal text scroll animation. */
  private scrollSpeed = 1.2;

  /** Container width used for scroll reset calculation. */
  private containerWidth = 120;

  /** Current scroll position of the text animation. */
  private scrollPos = 0;

  /** ID of the active animation frame. Used to cancel the animation if needed. */
  private frameId: number | null = null;

  /**
   * Injects Angular Router.
   * @param router Angular Router instance.
   */
  constructor(private router: Router) {}

  /**
   * Angular lifecycle hook called once during component initialization.
   * - Scrolls smoothly to the top of the page.
   * - Sets a gradient background specific to the Imprint view.
   * - Removes AOS animations (e.g. fade-right) only on mobile devices
   *   to show the content instantly without animation.
   * @returns void
   */
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.backgroundImage = 'linear-gradient(to top right, #1c1c1c 70%, #08463b)';

    // Disable AOS only on mobile devices (≤ 768px width)
    if (window.innerWidth <= 768) {
      const section = document.querySelector('.imprint-section');
      section?.removeAttribute('data-aos');
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   * Cleans up styles and stops the scroll animation.
   */
  ngOnDestroy(): void {
    document.body.style.backgroundImage = '';
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  /**
   * Starts the scroll animation of the back button text.
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
   * Performs a single step of the scroll animation and loops the text.
   * @param el The HTML element being animated.
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
   * Stops the scroll animation and resets the text position.
   */
  stopScroll(): void {
    const textEl = this.imprintTextRef.nativeElement;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;

    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    this.scrollPos = 0;
  }

  /**
   * Detects clicks outside the imprint container to navigate back.
   * @param event Mouse click event.
   */
  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const container = this.imprintContainerRef?.nativeElement;
    const inNavbar = !!target.closest('app-navbar');
    const inFooter = !!target.closest('app-footer');
    if (inNavbar || inFooter) return;

    if (container && !container.contains(target)) {
      this.router.navigate(['/']).then(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  }


  /**
   * Closes the imprint overlay and resets the page view.
   * Instantly scrolls the window (and document fallbacks) back to the very top
   * — ensuring the user starts at the top of the main page without animation.
   * @returns void
   */
  navigateHome(): void {
    const imprintSection = document.querySelector('.imprint-section');
    if (imprintSection) {
      imprintSection.classList.remove('visible');
    }
    document.body.classList.remove('dialog-open');
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}