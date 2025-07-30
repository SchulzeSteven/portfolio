import { Component, Renderer2 } from '@angular/core'; // Renderer2 hinzufügen!
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
  menuIsClose = true;
  dialogVisible = true;
  isIconInverted = false;

  constructor(public translate: TranslateService, private renderer: Renderer2) {
    const savedLang = localStorage.getItem('lang');
    const defaultLang = savedLang ?? 'en';

    this.translate.use(defaultLang);
    this.selectedLanguage = defaultLang.toUpperCase() === 'DE' ? 'DE' : 'EN';
  }

  toggleIconFilter() {
  this.isIconInverted = !this.isIconInverted;
}

  switchMenu(): void {
    this.menuIsClose = !this.menuIsClose;

    if (!this.menuIsClose) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      const isMobile = window.innerWidth <= 600;
      if (isMobile && !this.menuIsClose) {
        this.switchMenu();
      }
    }
  }

  toggleLanguage() {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
    const langCode = this.selectedLanguage.toLowerCase();

    this.translate.use(langCode);
    localStorage.setItem('lang', langCode);
  }
}