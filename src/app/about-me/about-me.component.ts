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
  const section = this.sectionRef.nativeElement;
  const image = section.querySelector('.about-me-img') as HTMLElement;
  const content = section.querySelector('.about-me-content') as HTMLElement;

  const offset = 350;

  const handleScroll = () => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - offset && rect.bottom > offset;

    if (inView) {
      image.classList.add('visible');
      image.classList.remove('invisible');

      content.classList.add('visible');
      content.classList.remove('invisible');
    } else {
      image.classList.add('invisible');
      image.classList.remove('visible');

      content.classList.add('invisible');
      content.classList.remove('visible');

      this.hasMoved = false;
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}



}
