import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { JogoDaVelhaComponent } from '../../components/jogo-da-velha/jogo-da-velha.component';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

enum ChatAction {
  CONNECT = "connect",
  SEND_MESSAGE = 'sendMessage',
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatComponent, JogoDaVelhaComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GameComponent implements OnInit {

  public messages = signal<string[]>([]);

  #connection!: signalR.HubConnection;

  public ngOnInit(): void {
    this.#createConnection();
    this.#connection.on(ChatAction.SEND_MESSAGE, (message: string) => {
      this.messages.update((oldValue) =>  [...oldValue, message]);
    });
  }

  #createConnection() {
    this.#connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      }).build();

      this.#connection.start().then(() => this.#connection.send(ChatAction.CONNECT, "gabariel"))
  }
}
