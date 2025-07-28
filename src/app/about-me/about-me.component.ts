import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrls: [
    './about-me.component.scss',
    './about-me.component-media-query.scss'
  ]
})
export class AboutMeComponent implements AfterViewInit {
  hasMoved = false;

  @ViewChild('aboutMeSection') sectionRef!: ElementRef;
  @ViewChild('aboutMeImg') imgRef!: ElementRef;
  @ViewChild('aboutMeContent') contentRef!: ElementRef;

  onHover(): void {
    this.hasMoved = true;
  }

  ngAfterViewInit(): void {
    const section = this.sectionRef.nativeElement;
    const image = this.imgRef.nativeElement as HTMLElement;
    const content = this.contentRef.nativeElement as HTMLElement;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Fade-In
            image.classList.add('visible');
            image.classList.remove('invisible');
            content.classList.add('visible');
            content.classList.remove('invisible');
          } else {
            // Fade-Out + Hover-Reset
            image.classList.remove('visible');
            image.classList.add('invisible');
            content.classList.remove('visible');
            content.classList.add('invisible');

            this.hasMoved = false; // 🟢 reset Hover-Status
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
  }
}