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
  @ViewChild('checkText') checkTextRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contactText') contactTextRef!: ElementRef<HTMLDivElement>;

  currentLanguage: 'en' | 'de' = 'en';
  private langChangeSub!: Subscription;

  private scrollSpeed = 1.2;
  private containerWidth = 120;

  private scrollState = {
    check: { pos: 0, frameId: null as number | null },
    contact: { pos: 0, frameId: null as number | null },
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
  this.currentLanguage = this.translate.currentLang as 'en' | 'de' || 'en';

  this.langChangeSub = this.translate.onLangChange.subscribe((event) => {
    this.currentLanguage = event.lang as 'en' | 'de';

    document.body.classList.toggle('lang-de', this.currentLanguage === 'de');
    document.body.classList.toggle('lang-en', this.currentLanguage === 'en');
  });

  document.body.classList.toggle('lang-de', this.currentLanguage === 'de');
  document.body.classList.toggle('lang-en', this.currentLanguage === 'en');
}

  changeLanguage(lang: 'en' | 'de') {
    this.translate.use(lang);
    this.currentLanguage = lang;
  }

  ngAfterViewInit(): void {
    this.resetTextPosition('check');
    this.resetTextPosition('contact');
  }

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

  private resetTextPosition(type: 'check' | 'contact') {
    const textEl = this.getTextElement(type);
    this.scrollState[type].pos = 0;
    textEl.style.transition = 'none';
    textEl.style.transform = 'translate(-50%, -50%)';
  }

  private getTextElement(type: 'check' | 'contact'): HTMLElement {
    return type === 'check'
      ? this.checkTextRef.nativeElement
      : this.contactTextRef.nativeElement;
  }

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

  ngOnDestroy(): void {
    Object.values(this.scrollState).forEach((state) => {
      if (state.frameId) cancelAnimationFrame(state.frameId);
    });

    if (this.langChangeSub) this.langChangeSub.unsubscribe();
  }
}
