import { Component, Renderer2 } from '@angular/core'; // Renderer2 added for DOM manipulation
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
  /** Currently selected language shown in the UI (EN or DE) */
  selectedLanguage: 'EN' | 'DE' = 'EN';

  /** Controls the open/closed state of the mobile menu */
  menuIsClose = true;

  /** Controls the visibility of the contact dialog (if used externally) */
  dialogVisible = true;

  /** Toggles the visual filter on the language icon */
  isIconInverted = false;

  constructor(
    public translate: TranslateService,
    private renderer: Renderer2
  ) {
    // Load language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('lang');
    const defaultLang = savedLang ?? 'en';

    this.translate.use(defaultLang);
    this.selectedLanguage = defaultLang.toUpperCase() === 'DE' ? 'DE' : 'EN';
  }

  /**
   * Toggles the appearance of the language icon (e.g., filter effect)
   */
  toggleIconFilter(): void {
    this.isIconInverted = !this.isIconInverted;
  }

  /**
   * Opens or closes the mobile navigation menu and locks/unlocks page scroll
   */
  switchMenu(): void {
    this.menuIsClose = !this.menuIsClose;

    if (!this.menuIsClose) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  /**
   * Smoothly scrolls to a specific section of the page by ID.
   * On mobile, closes the menu after navigation.
   * 
   * @param id The HTML element ID to scroll to.
   */
  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });

      const isMobile = window.innerWidth <= 600;
      if (isMobile && !this.menuIsClose) {
        this.switchMenu();
      }
    }
  }

  /**
   * Toggles the language between English and German,
   * updates TranslateService and saves the preference in localStorage.
   */
  toggleLanguage(): void {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
    const langCode = this.selectedLanguage.toLowerCase();

    this.translate.use(langCode);
    localStorage.setItem('lang', langCode);
  }
}