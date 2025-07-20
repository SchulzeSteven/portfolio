import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss'
})
export class AboutMeComponent implements AfterViewInit {
  hasMoved = false;

  @ViewChild('aboutMeSection') sectionRef!: ElementRef;

  onHover(): void {
    this.hasMoved = true;
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Wenn sichtbar → zurücksetzen
            this.hasMoved = false;
          }
        });
      },
      {
        threshold: 0.3 // Sichtbarkeitsschwelle
      }
    );

    observer.observe(this.sectionRef.nativeElement);
  }
}
