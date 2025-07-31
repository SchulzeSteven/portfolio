import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
    './landing-page.component-media-query.scss'
  ]
})
export class LandingPageComponent implements AfterViewInit, OnDestroy, OnInit {
  /** Reference to the "check" scroll text element */
  @ViewChild('checkText') checkTextRef!: ElementRef<HTMLDivElement>;

  /** Reference to the "contact" scroll text element */
  @ViewChild('contactText') contactTextRef!: ElementRef<HTMLDivElement>;

  /** Current selected language */
  currentLanguage: 'en' | 'de' = 'en';

  /** Subscription for language change listener */
  private langChangeSub!: Subscription;

  /** Speed of the scrolling text animation */
  private scrollSpeed = 1.2;

  /** Width used to determine when to reset scroll */
  private containerWidth = 120;

  /**
   * Stores individual scroll positions and animation frame IDs
   * for each scrollable text element
   */
  private scrollState = {
    check: { pos: 0, frameId: null as number | null },
    contact: { pos: 0, frameId: null as number | null },
  };

  constructor(private translate: TranslateService) {}

  /**
   * Initializes the current language and sets up body class and language change listener
   */
  ngOnInit(): void {
    this.currentLanguage = this.translate.currentLang as 'en' | 'de' || 'en';

    this.langChangeSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang as 'en' | 'de';

      document.body.classList.toggle('lang-de', this.currentLanguage === 'de');
      document.body.classList.toggle('lang-en', this.currentLanguage === 'en');
    });

    // Initial class assignment
    document.body.classList.toggle('lang-de', this.currentLanguage === 'de');
    document.body.classList.toggle('lang-en', this.currentLanguage === 'en');
  }

  /**
   * Changes the language manually
   * @param lang 'en' or 'de'
   */
  changeLanguage(lang: 'en' | 'de') {
    this.translate.use(lang);
    this.currentLanguage = lang;
  }

  /**
   * After view init: resets scroll position of all text elements
   */
  ngAfterViewInit(): void {
    this.resetTextPosition('check');
    this.resetTextPosition('contact');
  }

  /**
   * Starts scroll animation for the given text element
   * @param type Either 'check' or 'contact'
   */
  startScroll(type: 'check' | 'contact'): void {
    const el = this.getTextElement(type);
    const state = this.scrollState[type];

    state.pos = 0;
    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${state.pos}px), -50%)`;

    if (!state.frameId) {
      state.frameId = requestAnimationFrame(() =>
        this.scrollStep(el, state)
      );
    }
  }

  /**
   * Performs one step of the scroll animation
   * @param el The element to animate
   * @param state The current scroll state object for this element
   */
  private scrollStep(el: HTMLElement, state: { pos: number; frameId: number | null }): void {
    state.pos -= this.scrollSpeed;
    el.style.transform = `translate(calc(-50% + ${state.pos}px), -50%)`;

    if (state.pos + el.offsetWidth < -this.containerWidth / 2) {
      state.pos = this.containerWidth + el.offsetWidth;
    }

    state.frameId = requestAnimationFrame(() =>
      this.scrollStep(el, state)
    );
  }

  /**
   * Stops the scroll animation and resets the position
   * @param type 'check' or 'contact'
   */
  stopScroll(type: 'check' | 'contact') {
    const textEl = this.getTextElement(type);
    const state = this.scrollState[type];

    if (state.frameId) {
      cancelAnimationFrame(state.frameId);
      state.frameId = null;
    }

    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    state.pos = 0;
  }

  /**
   * Resets the scroll text to the initial centered position
   * @param type 'check' or 'contact'
   */
  private resetTextPosition(type: 'check' | 'contact') {
    const textEl = this.getTextElement(type);
    this.scrollState[type].pos = 0;
    textEl.style.transition = 'none';
    textEl.style.transform = 'translate(-50%, -50%)';
  }

  /**
   * Returns the HTML element reference based on type
   * @param type 'check' or 'contact'
   * @returns Corresponding HTMLElement
   */
  private getTextElement(type: 'check' | 'contact'): HTMLElement {
    return type === 'check'
      ? this.checkTextRef.nativeElement
      : this.contactTextRef.nativeElement;
  }

  /**
   * Smoothly scrolls to the specified anchor element
   * @param anchor ID of the target element
   */
  scrollTo(anchor: string): void {
    const element = document.getElementById(anchor);
    if (element) {
      const offset = anchor === 'contact' ? -110 : 0;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const position = elementRect - bodyRect + offset;

      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Cleans up active animations and subscriptions
   */
  ngOnDestroy(): void {
    Object.values(this.scrollState).forEach((state) => {
      if (state.frameId) cancelAnimationFrame(state.frameId);
    });

    if (this.langChangeSub) this.langChangeSub.unsubscribe();
  }
}