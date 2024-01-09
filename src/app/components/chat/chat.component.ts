import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild, effect, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import  * as signalR from '@microsoft/signalr';
import { UpperCasePipe } from '@angular/common';

enum ChatAction {
  CONNECT = "connect",
  SEND_MESSAGE = 'sendMessage',
}

interface IUserDetails {
  email: string;
  username: string;
}

interface IMessage {
  username: string;
  content: string;
  isMe: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [PickerComponent, ReactiveFormsModule, FormsModule, UpperCasePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scroll')
  scrollRef!: ElementRef;

  message = new FormControl('', [Validators.required, Validators.min(2)]);

  @Input({ required: true })
  connection!: signalR.HubConnection;

  userDetails = signal<IUserDetails | null>(null);

  scroll = signal<HTMLDivElement | null>(null);

  messages = signal<IMessage[]>([]);

  showEmojiPicker = signal(false);

  constructor() {
    effect(() => {
      if (this.userDetails() != null) {
        this.#start();
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.scroll.set(this.scrollRef.nativeElement);
  }

  @HostListener('document:keypress', ['$event'])
  onKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.message.valid) {
      this.connection.send(ChatAction.SEND_MESSAGE, this.userDetails()!.username, this.message.value);
      this.message.setValue('');
      const scroll = this.scroll();
      setTimeout(() => {
        scroll!.scrollTop = scroll?.scrollHeight! - scroll?.clientHeight!
      }, 100);
    }
  }

  addEmoji(event: EmojiEvent) {
    const currentValue = this.message.value ?? '';
    const newValue = currentValue + event.emoji.native;
    this.message.setValue(newValue)
    this.showEmojiPicker.set(false);
  }

  toggleEmojiPicker() {
    this.showEmojiPicker.set(!this.showEmojiPicker());
  }

  #start() {
      this.connection.on(ChatAction.SEND_MESSAGE, (username: string, message: string) => {
        const newMessage: IMessage = {
          username,
          content: message,
          isMe: username === this.userDetails()!.username,
        };
        this.messages.update((oldValue) =>  [...oldValue, newMessage]);
      });
  }
}
