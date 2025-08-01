import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Used for potential URL manipulation

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
    private renderer: Renderer2,
    private router: Router,
    private location: Location
  ) {
    const savedLang = localStorage.getItem('lang');
    const defaultLang = savedLang ?? 'en';

    this.translate.use(defaultLang);
    this.selectedLanguage = defaultLang.toUpperCase() === 'DE' ? 'DE' : 'EN';
  }

  /**
   * Toggles the visual filter (e.g. color inversion) on the language icon.
   */
  toggleIconFilter(): void {
    this.isIconInverted = !this.isIconInverted;
  }

  /**
   * Toggles the mobile navigation menu state between open and closed.
   */
  switchMenu(): void {
    this.menuIsClose = !this.menuIsClose;
  }

  /**
   * Smoothly scrolls to a section by ID.
   * If the current route is 'privacy' or 'imprint', it navigates back to the home page first,
   * then scrolls to the section without displaying a URL fragment.
   *
   * @param id - The HTML element ID to scroll to (e.g. "about", "skills")
   */
  scrollToSection(id: string): void {
    const isMobile = window.innerWidth <= 600;

    /**
     * Scrolls to the section and closes the mobile menu if open.
     */
    const scrollAndCleanUrl = () => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      if (!this.menuIsClose && isMobile) {
        this.switchMenu();
      }
    };

    if (this.router.url.includes('privacy') || this.router.url.includes('imprint')) {
      this.router.navigateByUrl('/').then(() => {
        setTimeout(() => {
          scrollAndCleanUrl();
        }, 50);
      });
    } else {
      scrollAndCleanUrl();
    }
  }

  /**
   * Toggles the language between English and German,
   * updates the TranslateService and stores the preference in localStorage.
   */
  toggleLanguage(): void {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
    const langCode = this.selectedLanguage.toLowerCase();

    this.translate.use(langCode);
    localStorage.setItem('lang', langCode);
  }
}