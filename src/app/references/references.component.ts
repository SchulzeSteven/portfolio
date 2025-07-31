import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Interface representing a reference comment (testimonial)
 */
interface ReferencesComments {
  nameKey: string;         // i18n key for the name
  rangKey: string;         // i18n key for the title/role
  descriptionKey: string;  // i18n key for the comment content
  id: number;              // identifier
}

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './references.component.html',
  styleUrls: [
    './references.component.scss',
    './references.component-media-query.scss',
  ]
})
export class ReferencesComponent implements OnInit {
  /** Total number of reference groups */
  totalReferences = 3;

  /** Currently active reference index */
  activeReferenceIndex = 0;

  /** Direction of transition animation ('left' or 'right') */
  direction = '';

  /** Controls whether the desktop animation is active */
  animate = false;

  /** Indicates whether the current device is touch-based */
  isTouchDevice = false;

  /**
   * Reference groups (3 groups of testimonials with different orderings)
   * These simulate rotating testimonials with the same data in varied sequences.
   */
  firstReferencesComments: ReferencesComments[] = [
    {
      id: 0,
      nameKey: "references.first.name.0",
      rangKey: "references.first.rang.0",
      descriptionKey: "references.first.description.0",
    },
    {
      id: 1,
      nameKey: "references.first.name.1",
      rangKey: "references.first.rang.1",
      descriptionKey: "references.first.description.1",
    },
    {
      id: 2,
      nameKey: "references.first.name.2",
      rangKey: "references.first.rang.2",
      descriptionKey: "references.first.description.2",
    }
  ];

  secondReferencesComments: ReferencesComments[] = [
    {
      id: 0,
      nameKey: "references.first.name.1",
      rangKey: "references.first.rang.1",
      descriptionKey: "references.first.description.1",
    },
    {
      id: 1,
      nameKey: "references.first.name.2",
      rangKey: "references.first.rang.2",
      descriptionKey: "references.first.description.2",
    },
    {
      id: 2,
      nameKey: "references.first.name.0",
      rangKey: "references.first.rang.0",
      descriptionKey: "references.first.description.0",
    }
  ];

  thirdReferencesComments: ReferencesComments[] = [
    {
      id: 0,
      nameKey: "references.first.name.2",
      rangKey: "references.first.rang.2",
      descriptionKey: "references.first.description.2",
    },
    {
      id: 1,
      nameKey: "references.first.name.0",
      rangKey: "references.first.rang.0",
      descriptionKey: "references.first.description.0",
    },
    {
      id: 2,
      nameKey: "references.first.name.1",
      rangKey: "references.first.rang.1",
      descriptionKey: "references.first.description.1",
    }
  ];

  /**
   * Detects if the current device is a touch device
   */
  ngOnInit(): void {
    this.isTouchDevice = window
      .matchMedia('(pointer: coarse) and (hover: none)')
      .matches;
  }

  /**
   * Returns the active set of reference comments to be displayed
   */
  get displayedReferencesComments(): ReferencesComments[] {
    if (this.activeReferenceIndex === 0) {
      return this.firstReferencesComments;
    } else if (this.activeReferenceIndex === 1) {
      return this.secondReferencesComments;
    }
    return this.thirdReferencesComments;
  }

  /**
   * Navigates to the next reference group based on scroll direction.
   * Chooses animation method based on device type.
   *
   * @param direction 'left' or 'right'
   */
  nextReferences(direction: 'left' | 'right'): void {
    if (this.isTouchDevice) {
      this.mobileAnimation(direction);
    } else {
      this.desktopAnimation(direction);
    }
  }

  /**
   * Handles reference group transitions for touch devices (no animation delay).
   *
   * @param direction 'left' or 'right'
   */
  mobileAnimation(direction: 'left' | 'right'): void {
    this.direction = direction;

    if (direction === 'left') {
      this.activeReferenceIndex =
        (this.activeReferenceIndex - 1 + this.totalReferences) %
        this.totalReferences;
    } else {
      this.activeReferenceIndex =
        (this.activeReferenceIndex + 1) % this.totalReferences;
    }
  }

  /**
   * Handles reference group transitions for desktop with animation delay.
   *
   * @param direction 'left' or 'right'
   */
  desktopAnimation(direction: 'left' | 'right'): void {
    this.direction = direction;
    this.animate = true;

    setTimeout(() => {
      if (direction === 'left') {
        this.activeReferenceIndex =
          (this.activeReferenceIndex - 1 + this.totalReferences) %
          this.totalReferences;
      } else {
        this.activeReferenceIndex =
          (this.activeReferenceIndex + 1) % this.totalReferences;
      }
      this.animate = false;
    }, 500);
  }
}