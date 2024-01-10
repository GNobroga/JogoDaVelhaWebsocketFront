import { Injectable, OnInit, effect, inject, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import IToken from '../models/IToken';
import { catchError, shareReplay, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import IUserLogin from '../models/IUserLogin';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = "access_token";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  #httpClient = inject(HttpClient);

  #toastrService = inject(ToastrService);

  #jwtHelper = inject(JwtHelperService);

  closeWebSockets = signal(false);

  public token$ = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.token$() != null) {
        this.saveToken(this.token$()!);
      }
    });
  }

  public ngOnInit(): void {
    this.token$.set(this.getToken());
  }

  public login(userLogin: IUserLogin) {
    this.closeWebSockets.set(false);
    return this.#httpClient
      .post<IToken>(`${environment.apiUrl}/api/auth`, userLogin)
      .pipe(
        shareReplay(),
        tap(() => this.#toastrService.success("Login efetuado.")),
        catchError(this.#showErrors.bind(this)),
        tap((result: any) => this.token$.set(result.token)));
  }

  public logout() {
    this.closeWebSockets.set(true);
    this.clearToken();
  }

  public clearToken() {
    this.token$.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  public saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getClaim(type: string): string | null {
    const entries = Object.entries(this.#jwtHelper.decodeToken(this.getToken()!));
    for (const [key, value] of entries) {
      if (key === type) {
        return <string> value;
      }
    }
    return null;
  }

  public isTokenValid(token: string) {
    return this.getToken() != null && !this.#jwtHelper.isTokenExpired(this.getToken());
  }


  #showErrors(res: any) {
    const details = res.error?.details as string[];
    for (const detail of details) {
      this.#toastrService.warning(detail, "Error");
    }
    return res;
  }

}
