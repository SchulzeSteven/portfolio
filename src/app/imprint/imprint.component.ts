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
  @ViewChild('imprintText') imprintTextRef!: ElementRef<HTMLDivElement>;

  private scrollSpeed = 1.2;
  private containerWidth = 120;
  private scrollPos = 0;
  private frameId: number | null = null;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.backgroundImage = 'linear-gradient(to top right, #1c1c1c 70%, #08463b)';
  }

  ngOnDestroy(): void {
    document.body.style.backgroundImage = '';
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

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

  private scrollStep(el: HTMLElement): void {
    this.scrollPos -= this.scrollSpeed;
    el.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    if (this.scrollPos + el.offsetWidth < -this.containerWidth / 2) {
      this.scrollPos = this.containerWidth + el.offsetWidth;
    }

    this.frameId = requestAnimationFrame(() => this.scrollStep(el));
  }

  stopScroll() {
    const textEl = this.imprintTextRef.nativeElement;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    this.scrollPos = 0;
  }
}