import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import IUserLogin from '../../models/IUserLogin';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import IUserCreate from '../../models/IUserCreate';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountComponent implements OnInit {

  #formBuilder = inject(FormBuilder);

  #authService = inject(AuthService);

  #accountService = inject(AccountService);

  #router = inject(Router);

  public login = this.#formBuilder.group({
    email: [''],
    password: [''],
  });

  public register = this.#formBuilder.group({
    username: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  public modeRegister = signal(false);

  public ngOnInit(): void {
    if (window.history.state?.email) {
      this.login.patchValue({ email: window.history.state.email });
      window.history.pushState(null, '');
    }
  }

  public logIn() {
      this.#authService
        .login(<IUserLogin> this.login.value)
        .subscribe(() => this.#router.navigate(['/game']));
  }


  public createAccount() {
    this.#accountService
      .create(this.register.value as IUserCreate)
      .subscribe(value => {
        this.toggleModeRegister();
        this.login.setValue({
          email: value.email,
          password: this.register.controls.password.value,
        });
      });

  }

  public toggleModeRegister() {
    this.modeRegister.set(!this.modeRegister());
  }
}
