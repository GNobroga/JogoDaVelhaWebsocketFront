import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountComponent {

}
