import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { JogoDaVelhaComponent } from '../../components/jogo-da-velha/jogo-da-velha.component';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { GameActionType } from '../../enums/GameActionType';
import { SharedModule } from '../../modules/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../modules/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ChatComponent,
    JogoDaVelhaComponent,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent implements OnInit, AfterViewInit {
  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  #authService = inject(AuthService);

  #accountService = inject(AccountService);

  #toastrService = inject(ToastrService);

  #dialog = inject(MatDialog);

  isConfirmedEmail = signal(false);

  constructor() {
    effect(
      () => {
        if (this.isConfirmedEmail()) {
          this.gameConnection.send(
            GameActionType.SEND_INVITE,
            this.user().email,
            this.email.value
          );
          this.email.setValue('');
          this.isConfirmedEmail.set(false);
        }
      },
      { allowSignalWrites: true }
    );
  }

  user = signal({
    email: this.#authService.getClaim('sub')!,
    username: this.#authService.getClaim('username')!,
  });

  email = new FormControl();

  chatConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.chatUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => this.#authService.getToken()!,
    })
    .build();

  gameConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.gameUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => this.#authService.getToken()!,
    })
    .build();

  isReadyToPlay = signal(false);

  public ngOnInit(): void {
    this.chatConnection.start();
    const { email, username } = this.user();
    this.gameConnection
      .start()
      .then(() => this.gameConnection.send(GameActionType.CONNECT, username));

    this.gameConnection.on(
      GameActionType.RECEIVE_INVITE,
      (invite: string, sender: string) => {
        const result = this.#dialog.open(DialogComponent, {
          data: { message: invite },
          width: '50vw',
        });
        result.afterClosed().subscribe((result) => {
          if (result) {
            this.gameConnection.send('startGame', email, sender);
            this.isReadyToPlay.set(true);
          } else {
            this.#toastrService.warning('Convite recusado');
            this.gameConnection.send('sendRefuseToPlayer', username, sender)
          }
        });
      }
    );

    this.gameConnection.on(
      GameActionType.RECEIVE_MESSAGE,
      (type: string, message: string) => {
        if (type === 'ERROR') {
          this.#toastrService.warning(message);
        } else if (type === 'RECONNECT') {
          this.isReadyToPlay.set(true);
          this.#toastrService.success(message);
        } else if (type === 'WARNING') {
          this.#toastrService.warning(message);
        } else {
          this.#toastrService.success(message);
        }
      }
    );
  }

  public invite() {
    this.#accountService
      .confirmEmail(this.email.value)
      .subscribe((value: any) => this.isConfirmedEmail.set(value.confirmed));
  }

  public ngAfterViewInit(): void {
    this.chatComponent.userDetails.set(this.user());
  }
}
