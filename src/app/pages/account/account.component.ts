import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountComponent {

  public modeRegister = signal(false);

  public toggleModeRegister() {
    this.modeRegister.set(!this.modeRegister());
  }
}
