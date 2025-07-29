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
  @ViewChild('privacyText') privacyTextRef!: ElementRef<HTMLDivElement>;

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

  startScroll() {
    const textEl = this.privacyTextRef.nativeElement;
    this.scrollPos = 0;
    textEl.style.transition = 'none';
    textEl.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

    const step = () => {
      this.scrollPos -= this.scrollSpeed;
      textEl.style.transform = `translate(calc(-50% + ${this.scrollPos}px), -50%)`;

      const totalWidth = this.containerWidth;
      const textWidth = textEl.offsetWidth;

      if (this.scrollPos + textWidth < -totalWidth / 2) {
        this.scrollPos = totalWidth + textWidth;
      }

      this.frameId = requestAnimationFrame(step);
    };

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(step);
    }
  }

  stopScroll() {
    const textEl = this.privacyTextRef.nativeElement;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    textEl.style.transition = 'transform 0.4s ease-out';
    textEl.style.transform = 'translate(-50%, -50%)';
    this.scrollPos = 0;
  }
}