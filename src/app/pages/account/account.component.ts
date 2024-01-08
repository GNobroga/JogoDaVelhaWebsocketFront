import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import IUserLogin from '../../models/IUserLogin';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AccountComponent {

  #formBuilder = inject(FormBuilder);

  #authService = inject(AuthService);

  #toastrService = inject(ToastrService);

  public login = this.#formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.min(5), Validators.max(100)]],
  });

  public register = this.#formBuilder.group({
    username: [''],
    email: [''],
    password: [''],
    confirmPassword: [''],
  });

  public modeRegister = signal(false);

  public logIn() {
    if (this.login.valid) {
      this.#authService.login(<IUserLogin> this.login.value).subscribe();
    } else {
      for (const control in this.login.controls) {
        if (this.login.get(control)?.errors) {
          this.#toastrService.warning(`Há um erro no(a) ${control}`);
        }
      }
    }
  }

  public toggleModeRegister() {
    this.modeRegister.set(!this.modeRegister());
  }
}
