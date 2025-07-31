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
  /**
   * The currently selected project for the dialog preview.
   * If null, the dialog is not visible.
   */
  selectedProject: Project | null = null;

  /**
   * Controls the visibility of the project details dialog.
   */
  dialogVisible = false;

  constructor(private renderer: Renderer2) {}

  /**
   * Opens the project details dialog with the given project.
   * Disables body scroll on large screens to avoid background scrolling.
   *
   * @param project The project to display in the dialog.
   */
  openDialog(project: Project): void {
    this.selectedProject = project;
    this.dialogVisible = true;

    if (window.innerWidth > 925) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  /**
   * Closes the project dialog and restores scrolling.
   */
  closeProjects(): void {
    this.dialogVisible = false;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  /**
   * Navigates to the next project in the list.
   * Loops back to the first project when the end is reached.
   *
   * @param currentId The ID of the currently displayed project.
   */
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

      // Uncomment and extend this list to add more projects
      /*
      {
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
      }
      */
    ];

    let nextId = currentId + 1;
    if (nextId > projects.length) {
      nextId = 1;
    }

    this.selectedProject = projects.find(p => p.id === nextId) || null;
  }
}