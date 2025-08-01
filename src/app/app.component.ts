import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Import AOS (Animate On Scroll)
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  /** Application title (not actively used here) */
  title = 'portfolio';

  /**
   * Angular lifecycle hook that runs after component initialization.
   * Initializes AOS (Animate On Scroll) with custom options.
   */
  ngOnInit(): void {
    AOS.init({
      duration: 500,           // Animation duration in milliseconds
      once: false,             // Whether animation should happen only once
      offset: 350,             // Offset from the bottom of the screen
      easing: 'ease-out-back'  // Animation easing style
    });
  }
}