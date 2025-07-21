import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrollText') scrollTextRef!: ElementRef<HTMLDivElement>;

  currentLang: 'de' | 'en' = 'en';

  private frameId: number | null = null;
  private pos = 0;
  private scrollSpeed = 1.2;
  private containerWidth = 120;

  private langChangeSub!: Subscription;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang as 'de' | 'en' || 'en';
    this.langChangeSub = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang as 'de' | 'en';
    });
  }

  skillSet = [
    { imgName: "HTML", name: "HTML" },
    { imgName: "CSS", name: "CSS" },
    { imgName: "JavaScript", name: "JavaScript" },
    { imgName: "Material_Design", name: "Material Design" },
    { imgName: "TypeScript", name: "TypeScript" },
    { imgName: "Angular", name: "Angular" },
    { imgName: "Firebase", name: "Firebase" },
    { imgName: "Git", name: "Git" },
    { imgName: "Rest-Api", name: "Rest-Api" },
    { imgName: "Scrum", name: "Scrum" },
    { imgName: "Growth_Mindset", name: "Growth Mindset" }
  ];

  ngAfterViewInit(): void {
    this.resetScroll();

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.resetScroll();
    });
  }

  startScroll(): void {
    const el = this.scrollTextRef.nativeElement;
    let pos = this.pos;
    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${pos}px), -50%)`;

    const step = () => {
      pos -= this.scrollSpeed;
      el.style.transform = `translate(calc(-50% + ${pos}px), -50%)`;

      if (pos + el.offsetWidth < -this.containerWidth / 2) {
        pos = this.containerWidth + el.offsetWidth;
      }

      this.pos = pos;
      this.frameId = requestAnimationFrame(step);
    };

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(step);
    }
  }

  stopScroll(): void {
    const el = this.scrollTextRef.nativeElement;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    el.style.transition = 'transform 0.4s ease-out';
    el.style.transform = 'translate(-50%, -50%)';
    this.pos = 0;
  }

  private resetScroll(): void {
    const el = this.scrollTextRef.nativeElement;
    this.pos = 0;
    el.style.transition = 'none';
    el.style.transform = 'translate(-50%, -50%)';
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) this.langChangeSub.unsubscribe();
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }
}