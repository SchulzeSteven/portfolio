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
  /**
   * Indicates whether the hover-triggered animation has already occurred.
   */
  hasMoved = false;

  // DOM references
  @ViewChild('aboutMeSection') sectionRef!: ElementRef;
  @ViewChild('aboutMeImg') imgRef!: ElementRef;
  @ViewChild('aboutMeContent') contentRef!: ElementRef;

  /**
   * Triggered on hover to activate a specific animation or state.
   */
  onHover(): void {
    this.hasMoved = true;
  }

  /**
   * Called after the view has fully initialized.
   * Retrieves DOM elements and starts observing the section visibility.
   */
  ngAfterViewInit(): void {
    const section = this.sectionRef.nativeElement;
    const image = this.imgRef.nativeElement as HTMLElement;
    const content = this.contentRef.nativeElement as HTMLElement;

    this.observeSection(section, image, content);
  }

  /**
   * Sets up an IntersectionObserver to watch when the section enters or exits the viewport.
   * Adds or removes CSS classes to animate visibility of child elements.
   *
   * @param section The DOM element of the entire section
   * @param image The image element inside the section
   * @param content The content element inside the section
   */
  private observeSection(section: HTMLElement, image: HTMLElement, content: HTMLElement): void {
    let previousY = section.getBoundingClientRect().top;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const currentY = entry.boundingClientRect.top;
        const scrollingUp = currentY > previousY;
        previousY = currentY;

        this.handleVisibility(entry.isIntersecting, scrollingUp, image, content);
      });
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

    observer.observe(section);
  }

  /**
   * Handles the visibility animation of image and content elements based on scroll direction and visibility.
   *
   * @param visible Whether the section is currently intersecting the viewport
   * @param scrollingUp Whether the user is scrolling upwards
   * @param image The image element to animate
   * @param content The content element to animate
   */
  private handleVisibility(visible: boolean, scrollingUp: boolean, image: HTMLElement, content: HTMLElement): void {
    if (visible) {
      image.classList.add('visible');
      image.classList.remove('invisible');
      content.classList.add('visible');
      content.classList.remove('invisible');
    } else if (scrollingUp) {
      image.classList.remove('visible');
      image.classList.add('invisible');
      content.classList.remove('visible');
      content.classList.add('invisible');
      this.hasMoved = false;
    }
  }
}