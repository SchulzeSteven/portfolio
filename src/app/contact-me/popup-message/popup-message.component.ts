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

  @Output()closeMessage = new EventEmitter<boolean>();

  closeDialog(){
    this.closeMessage.emit(false)
  }
}