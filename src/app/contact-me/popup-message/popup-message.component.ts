import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pop-up-message',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss'
})
export class PopUpMessageComponent {

  /**
   * Emits a value when the pop-up message is closed.
   * Typically used to notify the parent component.
   */
  @Output() closeMessage = new EventEmitter<boolean>();

  /**
   * Triggers the closing of the dialog by emitting `false`.
   */
  closeDialog(): void {
    this.closeMessage.emit(false);
  }
}