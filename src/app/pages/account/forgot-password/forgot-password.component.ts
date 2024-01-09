import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import IForgotAccount from '../../../models/IForgotAccount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ForgotPasswordComponent {

  #formBuilder = inject(FormBuilder);

  #accountService = inject(AccountService);

  #router = inject(Router);

  isEmailConfirmed = this.#accountService.isEmailConfirmed$.asReadonly();

  public form = this.#formBuilder.group({
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  public submit() {
    this.#accountService.confirmEmail(this.form.controls.email.value!).subscribe();
    if (this.isEmailConfirmed())
      this.#accountService
      .forgotAccount(this.form.value as IForgotAccount)
      .subscribe(_ => this.#router.navigate(['/account']))
  }
}
