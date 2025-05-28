import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('checkText') checkTextRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contactText') contactTextRef!: ElementRef<HTMLDivElement>;

  private scrollSpeed = 1.2;
  private containerWidth = 120;

  private scrollState = {
    check: { pos: 0, frameId: null as number | null },
    contact: { pos: 0, frameId: null as number | null },
  };

  ngAfterViewInit(): void {
    this.resetTextPosition('check');
    this.resetTextPosition('contact');
  }

  startScroll(type: 'check' | 'contact') {
    const textEl = this.getTextElement(type);
    const state = this.scrollState[type];

    let scrollPos = state.pos;
    textEl.style.transition = 'none';
    textEl.style.transform = `translate(calc(-50% + ${scrollPos}px), -50%)`;

    const step = () => {
      scrollPos -= this.scrollSpeed;
      textEl.style.transform = `translate(calc(-50% + ${scrollPos}px), -50%)`;

      const totalWidth = this.containerWidth;
      const textWidth = textEl.offsetWidth;

      if (scrollPos + textWidth < -totalWidth / 2) {
        scrollPos = totalWidth + textWidth;
      }

      state.pos = scrollPos;
      state.frameId = requestAnimationFrame(step);
    };

    if (!state.frameId) {
      state.frameId = requestAnimationFrame(step);
    }
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

  ngOnDestroy(): void {
    Object.values(this.scrollState).forEach((state) => {
      if (state.frameId) cancelAnimationFrame(state.frameId);
    });
  }
}
