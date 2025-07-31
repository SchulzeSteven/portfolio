import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { SkillsComponent } from '../skills/skills.component';
import { FeaturedProjectsComponent, Project } from '../featured-projects/featured-projects.component';
import { ReferencesComponent } from '../references/references.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LandingPageComponent,
    AboutMeComponent,
    SkillsComponent,
    FeaturedProjectsComponent,
    ReferencesComponent,
    ContactMeComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrls: [
    './main-content.component.scss',
    './main-content.component-media-query.scss',
  ]
})
export class MainContentComponent {
  selectedProject: Project | null = null;
  dialogVisible = false;

  constructor(private renderer: Renderer2) {}

  openDialog(project: Project): void {
  this.selectedProject = project;
  this.dialogVisible = true;

  if (window.innerWidth > 925) {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  } else {
    this.renderer.removeStyle(document.body, 'overflow');
  }
}


  closeProjects(): void {
    this.dialogVisible = false;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  nextProject(currentId: number): void {
    const projects: Project[] = [
      {
        id: 1,
        nameKey: 'projects.join.name',
        descriptionKey: 'projects.join.description',
        namePng: 'Join',
        technologies: {
          tech1: 'JavaScript',
          tech2: 'HTML',
          tech3: 'CSS',
          tech4: 'Firebase'
        },
        linkGitHub: 'https://github.com/SchulzeSteven/join',
        linkLive: 'https://steven-schulze.com/join/'
      },
      {
        id: 2,
        nameKey: 'projects.elPolloLoco.name',
        descriptionKey: 'projects.elPolloLoco.description',
        namePng: 'EL_Pollo_Loco',
        technologies: {
          tech1: 'HTML',
          tech2: 'CSS',
          tech3: 'JavaScript'
        },
        linkGitHub: 'https://github.com/SchulzeSteven/El-Pollo-Loco',
        linkLive: 'https://steven-schulze.com/El-Pollo-Loco/'
      },

      // ---- Add for next projects ----
      /* {
        id: 3,
        nameKey: 'projects.dabubble.name',
        descriptionKey: 'projects.dabubble.description',
        namePng: 'DABubble',
        technologies: {
          tech1: 'Angular',
          tech2: 'Firebase',
          tech3: 'TypeScript'
        },
        linkGitHub: '//',
        linkLive: ''
      } */
    ];

    let nextId = currentId + 1;
    if (nextId > projects.length) {
      nextId = 1;
    }

    this.selectedProject = projects.find(p => p.id === nextId) || null;
  }
}