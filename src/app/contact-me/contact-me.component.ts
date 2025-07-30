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
  imports: [FormsModule, CommonModule, PopUpMessageComponent, TranslatePipe, RouterLink],
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss', './contact-me.component-media-query.scss'],
})
export class ContactMeComponent implements OnInit, OnDestroy {
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('scrollText') scrollTextRef!: ElementRef<HTMLDivElement>;

  buttonChecked = false;
  mailTest = false;
  isInputHoveredEmail = false;
  isInputHoveredMessage = false;
  sendFormular = false;
  animate = false;
  isTouchDevice = false;

  contactData = {
    name: '',
    email: '',
    message: '',
  };

  currentLang: 'de' | 'en' = 'en';
  private langChangeSub!: Subscription;

  private http = inject(HttpClient);

  private frameId: number | null = null;
  private pos = 0;
  private scrollSpeed = 1.2;
  private containerWidth = 120;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang as 'de' | 'en' || 'en';
    this.langChangeSub = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang as 'de' | 'en';
      AOS.refreshHard();
    });
  }

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

  ngOnInit(): void {
    this.isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) this.langChangeSub.unsubscribe();
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  logCloseDialog(status: boolean): void {
    this.animate = true;
    setTimeout(() => {
      this.sendFormular = status;
      this.setOverflow(this.sendFormular);
      this.animate = false;
      this.dialogClosed.emit(this.sendFormular);
    }, 500);
  }

  checkButtonPolicy(): void {
    this.buttonChecked = !this.buttonChecked;
  }

  setOverflow(isFormularSent: boolean): void {
    if (isFormularSent) {
      this.renderer.addClass(document.body, 'overflow_hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow_hidden');
    }
  }

  checkFormular(ngForm: NgForm): void {
    if (ngForm.invalid) {
      Object.keys(ngForm.controls).forEach((field) => {
        const control = ngForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    } else if (ngForm.submitted && ngForm.form.valid) {
      if (!this.mailTest) {
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
              console.error("Mail konnte nicht gesendet werden:", error);
              alert("Fehler beim Senden der Nachricht. Bitte versuch es später erneut.");
            }
          });
      } else {
        ngForm.resetForm();
      }
    }
  }

  startScroll(): void {
    const el = this.scrollTextRef?.nativeElement;
    if (!el) return;

    let pos = this.pos;
    el.style.transition = 'none';
    el.style.transform = `translate(calc(-50% + ${pos}px), -50%)`;

    const step = () => {
      pos -= this.scrollSpeed;
      el.style.transform = `translate(calc(-50% + ${pos}px), -50%)`;

      if (pos + el.offsetWidth < -this.containerWidth / 2) {
        pos = this.containerWidth + el.offsetWidth;
      }

      this.pos = pos;
      this.frameId = requestAnimationFrame(step);
    };

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(step);
    }
  }

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