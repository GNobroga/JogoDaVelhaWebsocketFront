import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';


interface IUserDetails {
  email: string;
  username: string;
}

enum GameActionType {
  CONNECT = 'connect',
  SEND_INVITE = 'sendInvite',
  RECEIVE_INVITE = 'receiveInvite',
}

@Component({
  selector: 'app-jogo-da-velha',
  standalone: true,
  imports: [],
  templateUrl: './jogo-da-velha.component.html',
  styleUrl: './jogo-da-velha.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JogoDaVelhaComponent implements OnInit {

  @Input({ required: true })
  public connection!: signalR.HubConnection;

  @Input({ required: true })
  public userDetails = signal({} as IUserDetails);

  public ngOnInit(): void {

  }

}
