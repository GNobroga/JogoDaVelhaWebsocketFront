import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { JogoDaVelhaComponent } from '../../components/jogo-da-velha/jogo-da-velha.component';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatComponent, JogoDaVelhaComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GameComponent implements OnInit, AfterViewInit {

  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  #authService = inject(AuthService);

  isReadyToPlay = signal(false);

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
      this.chatComponent.userDetails.set({
        email: this.#authService.getClaim('sub')!,
        username: this.#authService.getClaim('username')!,
        token: this.#authService.getToken()!,
      });
  }

}
