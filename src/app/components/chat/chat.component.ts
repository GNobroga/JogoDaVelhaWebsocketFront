import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnInit, effect, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { environment } from '../../../environments/environment';
import  * as signalR from '@microsoft/signalr';

enum ChatAction {
  CONNECT = "connect",
  SEND_MESSAGE = 'sendMessage',
}

interface IUserDetails {
  email: string;
  username: string;
  token: string;
}

interface IMessage {
  username: string;
  content: string;
  isMe: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [PickerComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {

  message = new FormControl('', [Validators.required, Validators.min(2)]);

  #connection!: signalR.HubConnection;

  userDetails = signal<IUserDetails | null>(null);

  messages = signal<IMessage[]>([]);

  showEmojiPicker = signal(false);

  constructor() {
    effect(() => {
      if (this.userDetails() != null) {
        this.#createConnection();
      }
    });
  }

  ngOnInit() {}

  @HostListener('document:keypress', ['$event'])
  onKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.message.valid) {
      this.#connection.send(ChatAction.SEND_MESSAGE, this.userDetails()!.username, this.message.value);
      this.message.setValue('');
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

  #createConnection() {
    this.#connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.userDetails()!.token,
      }).build();

      this.#connection.start().then(() => this.#connection.send(
        ChatAction.CONNECT,
        this.userDetails()!.username,
      ));

      this.#connection.on(ChatAction.SEND_MESSAGE, (username: string, message: string) => {
        const newMessage: IMessage = {
          username,
          content: message,
          isMe: username === this.userDetails()!.username,
        };
        this.messages.update((oldValue) =>  [...oldValue, newMessage]);
      });
  }
}
