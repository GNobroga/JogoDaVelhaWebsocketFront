import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [PickerComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {

  message = new FormControl('');

  showEmojiPicker = signal(false);

  addEmoji(event: EmojiEvent) {
    const currentValue = this.message.value ?? '';
    const newValue = currentValue + event.emoji.native;
    this.message.setValue(newValue)
    console.log(event.emoji.native);
    this.showEmojiPicker.set(false);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.set(!this.showEmojiPicker());
  }
}
