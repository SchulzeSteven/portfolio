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
      duration: 500,
      once: false,
      offset: 350,
      easing: 'ease-out-back'
    });
  }
}