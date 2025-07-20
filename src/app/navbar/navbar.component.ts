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
    this.translate.use('en');
  }

  toggleLanguage() {
    this.selectedLanguage = this.selectedLanguage === 'EN' ? 'DE' : 'EN';
    this.translate.use(this.selectedLanguage.toLowerCase());
  }
}
