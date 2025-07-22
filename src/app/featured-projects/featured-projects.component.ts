import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


interface Project {
  id: number;
  nameKey: string;
  descriptionKey: string;
  namePng: string,
  technologies: { [key: string]: string },
  linkGitHub: string,
  linkLive: string,
}


/**
 * Describes a featured project with metadata, links, and technologies used.
 *
 * @interface Project
 */
interface Project {
  /**
   * Unique identifier of the project.
   *
   * @type {number}
   */
  id: number;
  /**
   * Translation key for the project name.
   *
   * @type {string}
   */
  nameKey: string;
  /**
   * Translation key for the project description.
   *
   * @type {string}
   */
  descriptionKey: string;
  /**
   * Filename (without extension) for the project thumbnail PNG.
   *
   * @type {string}
   */
  namePng: string;
  /**
   * Map of technology keys to their display names used in the project.
   *
   * @type {{ [key: string]: string }}
   */
  technologies: { [key: string]: string };
  /**
   * URL to the project's GitHub repository.
   *
   * @type {string}
   */
  linkGitHub: string;
  /**
   * URL to the live demo of the project.
   *
   * @type {string}
   */
  linkLive: string;
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './featured-projects.component.html',
  styleUrls: [
    './featured-projects.component.scss',
    './featured-projects-single-details.component.scss',
    './featured-projects.component-media-query.scss',
  ]
})
/**
 * FeaturedProjectsComponent
 *
 * A standalone Angular component that displays a list of featured projects.
 * Supports hover previews, dialog display of project details, and navigation
 * between projects. It also disables page scrolling when the details dialog is open.
 */
export class FeaturedProjectsComponent {
  /**
   * Currently selected project for detail view, or null if none.
   *
   * @type {Project | null}
   * @memberof FeaturedProjectsComponent
   */
  selectedProject: Project | null = null;

  /**
   * Whether the project details dialog is visible.
   *
   * @type {boolean}
   * @memberof FeaturedProjectsComponent
   */
  dialogVisible = false;

  /**
   * Controls the preview animation toggle state.
   *
   * @type {boolean}
   * @memberof FeaturedProjectsComponent
   */
  animation = false;

  /**
   * Index of the project currently being previewed.
   *
   * @type {number}
   * @memberof FeaturedProjectsComponent
   */
  projectNumber!: number;

  /**
   * List of all featured projects to display.
   *
   * @type {Project[]}
   * @memberof FeaturedProjectsComponent
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
      linkLive: "https://steven-schulze.com/",
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
      linkLive: "https://steven-schulze.com/"
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
   * Creates an instance of FeaturedProjectsComponent.
   *
   * @param {Renderer2} renderer Angular Renderer2 for DOM style manipulations.
   * @memberof FeaturedProjectsComponent
   */
  constructor(private renderer: Renderer2) { }

  /**
   * Toggles the preview animation for a hovered project.
   * Does nothing if the provided index is out of bounds (4).
   *
   * @param {number} projectNumber - Index of the project to preview.
   * @returns {void}
   * @memberof FeaturedProjectsComponent
   */
  showPreviewProjects(projectNumber: number): void {
    if (projectNumber === 4) {
      return;
    }
    this.animation = !this.animation;
    this.projectNumber = projectNumber;
  }

  /**
   * Opens the details dialog for the selected project.
   * Disables page scrolling by setting `overflow: hidden` on the body.
   * Does nothing if the provided ID is out of bounds (4).
   *
   * @param {number} selectId - The ID of the project to show.
   * @returns {void}
   * @memberof FeaturedProjectsComponent
   */
  showProjects(selectId: number): void {
    if (selectId === 4) {
      return;
    }
    this.selectedProject = this.projects.find(p => p.id === selectId) || null;
    this.dialogVisible = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * Closes the project details dialog and restores page scrolling.
   *
   * @returns {void}
   * @memberof FeaturedProjectsComponent
   */
  closeProjects(): void {
    this.dialogVisible = false;
    this.renderer.removeStyle(document.body, 'overflow');
  }

  /**
   * Advances to the next project in the list.
   * Wraps around to the first project after the last.
   *
   * @param {number} selectId - Current project ID.
   * @returns {void}
   * @memberof FeaturedProjectsComponent
   */
  nextProject(selectId: number): void {
  let nextId = selectId + 1;
  if (nextId > this.projects.length) {
    nextId = 1;
  }
  this.selectedProject = this.projects.find(p => p.id === nextId) || null;
}

}