import { ChangeDetectionStrategy, Component, Input, OnInit, computed, signal } from '@angular/core';
import { GameActionType } from '../../enums/GameActionType';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface IUserDetails {
  email: string;
  username: string;
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

  public tableRowsAndCols: { row: number, col: number }[] = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ]

  public table = signal<string[]>([]);

  public roundValue = signal<string | null>(null);

  public currentRoundValue = signal<string | null>(null);

  public ngOnInit(): void {
    this.connection.on(GameActionType.RECEIVE_PLAYER_VALUE, (value: string) => {
      this.roundValue.set(value);
    });

    this.connection.on(GameActionType.RECEIVE_ROUND, (round: string) => {
      this.currentRoundValue.set(round);
    });

    this.connection.on(GameActionType.UPDATE_TABLE, (table: string[]) => {
      this.table.set(table);
    });

  }

  public markTable(row: number, col: number) {
    this.connection.send('markTable', this.userDetails().email, row, col);
  }

}
