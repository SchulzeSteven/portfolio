import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  selectedLanguage: 'EN' | 'DE' = 'EN';

  toggleLanguage() {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
  }
}
