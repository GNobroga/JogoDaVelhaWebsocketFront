import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { JogoDaVelhaComponent } from '../../components/jogo-da-velha/jogo-da-velha.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatComponent, JogoDaVelhaComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class GameComponent {

}
