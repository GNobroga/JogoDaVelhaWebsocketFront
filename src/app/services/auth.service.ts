import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import IToken from '../models/IToken';
import { catchError, shareReplay, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import IUserLogin from '../models/IUserLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #httpClient = inject(HttpClient);

  #toastrService = inject(ToastrService);

  public token$ = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.token$() != null) {
        localStorage.setItem('access_token', this.token$() as string);
      }
    });
  }

  public login(userLogin: IUserLogin) {
    return this.#httpClient
      .post<IToken>(`${environment.apiUrl}/api/auth`, userLogin)
      .pipe(shareReplay())
      .pipe(catchError(err => {
        console.log(err);
        this.#toastrService.error(err.error.detail, "Error");
        return err;
      }))
      .pipe(tap((result: any) => {
        this.token$.set(result.token);
        this.#toastrService.success("Usuário conectado");
      }))
  }
}
