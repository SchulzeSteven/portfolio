import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  selectedLanguage: 'EN' | 'DE' = 'EN';

  constructor(public translate: TranslateService) {
    const savedLang = localStorage.getItem('lang');

    // 👉 Immer 'en' als Standard, nur wenn savedLang vorhanden, dann verwenden
    const defaultLang = savedLang ?? 'en';

    this.translate.use(defaultLang);
    this.selectedLanguage = defaultLang.toUpperCase() === 'DE' ? 'DE' : 'EN';
  }

  toggleLanguage() {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
    const langCode = this.selectedLanguage.toLowerCase();

    this.translate.use(langCode);
    localStorage.setItem('lang', langCode);
  }
}