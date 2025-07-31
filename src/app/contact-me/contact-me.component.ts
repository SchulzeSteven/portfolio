import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { PopUpMessageComponent } from './popup-message/popup-message.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PopUpMessageComponent,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss', './contact-me.component-media-query.scss'],
})
export class ContactMeComponent implements OnInit, OnDestroy {
  /** Emits true/false when the contact form dialog is closed */
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Reference to the scrolling text element */
  @ViewChild('scrollText') scrollTextRef!: ElementRef<HTMLDivElement>;

  // UI state variables
  buttonChecked = false;
  mailTest = false;
  isInputHoveredEmail = false;
  isInputHoveredMessage = false;
  sendFormular = false;
  animate = false;
  isTouchDevice = false;

  /** Contact form data */
  contactData = {
    name: '',
    email: '',
    message: '',
  };

  /** Currently active language */
  currentLang: 'de' | 'en' = 'en';
  private langChangeSub!: Subscription;

  private http = inject(HttpClient);

  // Variables for scroll animation
  private frameId: number | null = null;
  private pos = 0;
  private scrollSpeed = 1.2;
  private containerWidth = 120;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    // Set initial language
    this.currentLang = this.translate.currentLang as 'de' | 'en' || 'en';

    // Subscribe to language changes and refresh AOS animations
    this.langChangeSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang as 'de' | 'en';
      AOS.refreshHard();
    });
  }

  /** Configuration for POST request to backend PHP mail endpoint */
  post = {
    endPoint: 'https://steven-schulze.com/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  /** Detect if touch device is used */
  ngOnInit(): void {
    this.isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
  }

  /** Unsubscribe from language changes and cancel scroll animation */
  ngOnDestroy(): void {
    if (this.langChangeSub) this.langChangeSub.unsubscribe();
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  /**
   * Closes the dialog and sets form submission state
   * @param status Whether the form was sent successfully
   */
  logCloseDialog(status: boolean): void {
    this.animate = true;
    setTimeout(() => {
      this.sendFormular = status;
      this.setOverflow(this.sendFormular);
      this.animate = false;
      this.dialogClosed.emit(this.sendFormular);
    }, 500);
  }

  /** Toggles the button state (e.g., privacy policy checkbox) */
  checkButtonPolicy(): void {
    this.buttonChecked = !this.buttonChecked;
  }

  /**
   * Controls body overflow when form is sent or closed
   * @param isFormularSent Whether the form has been successfully submitted
   */
  setOverflow(isFormularSent: boolean): void {
    if (isFormularSent) {
      this.renderer.addClass(document.body, 'overflow_hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow_hidden');
    }
  }

  /**
   * Validates and sends the contact form
   * @param ngForm The Angular form reference
   */
  checkFormular(ngForm: NgForm): void {
    if (ngForm.invalid) {
      // Mark all fields as touched for validation
      Object.keys(ngForm.controls).forEach((field) => {
        const control = ngForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else if (ngForm.submitted && ngForm.form.valid) {
      if (!this.mailTest) {
        // Send form data to backend
        this.http
          .post(
            this.post.endPoint,
            this.post.body(this.contactData),
            this.post.options
          )
          .subscribe({
            next: () => {
              this.sendFormular = true;
              this.setOverflow(true);
              ngForm.resetForm();
            },
            error: (error) => {
              console.error("Mail could not be sent:", error);
              alert("Failed to send message. Please try again later.");
            }
          });
      } else {
        // Testing mode: reset form without sending
        ngForm.resetForm();
      }
    }
  }

  /** Starts horizontal scrolling animation of the button text */
  startScroll(): void {
    const el = this.scrollTextRef?.nativeElement;
    if (!el || this.frameId) return;

    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${this.pos}px), -50%)`;

    this.frameId = requestAnimationFrame(() => this.scrollStep(el));
  }

  /**
   * Handles a single animation frame of the scrolling text
   * @param el The scroll text element
   */
  private scrollStep(el: HTMLElement): void {
    this.pos -= this.scrollSpeed;
    el.style.transform = `translate(calc(-50% + ${this.pos}px), -50%)`;

    // Reset position when it scrolls out of view
    if (this.pos + el.offsetWidth < -this.containerWidth / 2) {
      this.pos = this.containerWidth + el.offsetWidth;
    }

    this.frameId = requestAnimationFrame(() => this.scrollStep(el));
  }

  /** Stops the scroll animation and resets the position */
  stopScroll(): void {
    const el = this.scrollTextRef?.nativeElement;
    if (!el) return;

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    el.style.transition = 'transform 0.4s ease-out';
    el.style.transform = 'translate(-50%, -50%)';
    this.pos = 0;
  }
}