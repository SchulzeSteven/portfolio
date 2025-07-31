import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Interface representing the structure of a project item
 */
export interface Project {
  id: number;
  nameKey: string;         // Translation key for project name
  descriptionKey: string;  // Translation key for project description
  namePng: string;         // Filename for the preview image
  technologies: { [key: string]: string }; // Technologies used
  linkGitHub: string;      // GitHub repository link
  linkLive: string;        // Live deployment link
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './featured-projects.component.html',
  styleUrls: [
    './featured-projects.component.scss',
    './featured-projects.component-media-query.scss',
  ]
})
export class FeaturedProjectsComponent {
  /**
   * Emits the selected project to be shown in the project dialog
   */
  @Output() openDialog = new EventEmitter<Project>();

  /** Controls animation trigger state */
  animation = false;

  /** Stores the currently selected project number */
  projectNumber!: number;

  /**
   * List of featured projects displayed in the UI
   */
  projects: Project[] = [
    {
      id: 1,
      nameKey: "projects.join.name",
      descriptionKey: "projects.join.description",
      namePng: "Join",
      technologies: {
        tech1: "JavaScript",
        tech2: "HTML",
        tech3: "CSS",
        tech4: "Firebase"
      },
      linkGitHub: "https://github.com/SchulzeSteven/join",
      linkLive: "https://steven-schulze.com/join/",
    },
    {
      id: 2,
      nameKey: "projects.elPolloLoco.name",
      descriptionKey: "projects.elPolloLoco.description",
      namePng: "EL_Pollo_Loco",
      technologies: {
        tech1: "HTML",
        tech2: "CSS",
        tech3: "JavaScript"
      },
      linkGitHub: "https://github.com/SchulzeSteven/El-Pollo-Loco",
      linkLive: "https://steven-schulze.com/El-Pollo-Loco/"
    },
    {
      id: 3,
      nameKey: "projects.dabubble.name",
      descriptionKey: "projects.dabubble.description",
      namePng: "DABubble",
      technologies: {
        tech1: "Angular",
        tech2: "Firebase",
        tech3: "TypeScript"
      },
      linkGitHub: "//",
      linkLive: "",
    }
  ];

  /**
   * Toggles the preview animation for the project boxes
   * @param projectNumber Number representing the selected project preview
   */
  showPreviewProjects(projectNumber: number): void {
    if (projectNumber === 4) return; // Reserved or unused project number
    this.animation = !this.animation;
    this.projectNumber = projectNumber;
  }

  /**
   * Emits a selected project to the parent component to open a dialog
   * @param selectId ID of the selected project
   */
  showProjects(selectId: number): void {
    const project = this.projects.find(p => p.id === selectId);
    if (project) {
      this.openDialog.emit(project);
    }
  }
}