import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

// ⬅️ AOS importieren
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  // ⬅️ AOS initialisieren
  ngOnInit(): void {
    AOS.init({
      duration: 600,         // Geschwindigkeit
      once: false,           // Jedes Mal animieren beim Scroll
      offset: 250,           // Globaler Abstand vom Viewport
      easing: 'ease-out-back' // Animationseffekt
    });
  }
}

