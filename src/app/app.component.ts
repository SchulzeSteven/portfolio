import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  /** Application title (not actively used here) */
  title = 'portfolio';

  constructor(private router: Router) {}

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Initializes AOS (Animate On Scroll) with custom options.
   */
  ngOnInit(): void {
    AOS.init({
      duration: 500,
      once: false,
      offset: 350,
      easing: 'ease-out-back'
    });
  }

  /**
   * Handles fragment navigation after route changes.
   * Ensures scrolling to specific sections like #about, #skills etc.
   */
  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
          // Warte kurz, bis DOM vollständig gerendert ist
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              const yOffset = -80; // Offset für feste Navbar
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 50);
        }
      }
    });
  }
}