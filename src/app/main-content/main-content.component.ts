import { Component } from '@angular/core';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { SkillsComponent } from '../skills/skills.component';
import { FeaturedProjectsComponent } from '../featured-projects/featured-projects.component';
import { ReferencesComponent } from '../references/references.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [LandingPageComponent, AboutMeComponent, SkillsComponent, FeaturedProjectsComponent, ReferencesComponent, ContactMeComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
