import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface Project {
  id: number;
  nameKey: string;
  descriptionKey: string;
  namePng: string;
  technologies: { [key: string]: string };
  linkGitHub: string;
  linkLive: string;
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

  @Output() openDialog = new EventEmitter<Project>();

  animation = false;
  projectNumber!: number;

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

  showPreviewProjects(projectNumber: number): void {
    if (projectNumber === 4) return;
    this.animation = !this.animation;
    this.projectNumber = projectNumber;
  }

  showProjects(selectId: number): void {
  const project = this.projects.find(p => p.id === selectId);
  if (project) {
    this.openDialog.emit(project);
  }
}
}