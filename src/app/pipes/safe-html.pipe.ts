import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * A custom Angular pipe that marks specific HTML strings as safe for rendering.
 *
 * This pipe allows rendering of trusted HTML content (e.g. from translation files)
 * by bypassing Angular’s built-in HTML sanitization via the DomSanitizer service.
 *
 * Important:
 * Use this pipe **only** for trusted, static content (e.g. i18n text with <span>, <br> etc.).
 * Never use it for user-generated input, as it disables Angular’s XSS protection.
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  /**
   * Creates an instance of SafeHtmlPipe.
   *
   * @param sanitizer - Angular's DomSanitizer service used to mark HTML content as safe.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Transforms a given HTML string into a SafeHtml object that Angular can safely render.
   *
   * @param value - The raw HTML string to be trusted and rendered in the template.
   * @returns A SafeHtml object that Angular will allow to be bound via [innerHTML].
   */
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}