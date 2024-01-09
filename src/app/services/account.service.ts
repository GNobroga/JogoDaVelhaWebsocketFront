import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import IUserCreate from '../models/IUserCreate';
import { environment } from '../../environments/environment';
import { Observable, catchError, shareReplay, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import IForgotAccount from '../models/IForgotAccount';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  #httpClient = inject(HttpClient);

  #toastrService = inject(ToastrService);

  isEmailConfirmed$ = signal(false);

  public create(record: IUserCreate) {
    return this.#httpClient
      .post<IUserCreate>(`${environment.apiUrl}/account/create-account`, record)
      .pipe(
        shareReplay(),
        tap(() => this.#toastrService.success("Cadastrado realizado.")),
        catchError(this.#showErrors.bind(this))
      ) as Observable<IUserCreate>;
  }

  public forgotAccount(info: IForgotAccount) {
    return this.#httpClient
      .patch<IUserCreate>(`${environment.apiUrl}/account/forgot-account`, info)
      .pipe(
        catchError(this.#showErrors.bind(this)),
        tap(() => this.#toastrService.success("Senha modificada."))
      );
  }

  public confirmEmail(email: string) {
    return this.#httpClient
      .post<{ confirmed: boolean; }>(`${environment.apiUrl}/account/confirm-email`, { email })
      .pipe(
        tap(value => {
          this.isEmailConfirmed$.set(value.confirmed);
          if (!value.confirmed) {
            this.#toastrService.warning("E-mail não encontrado.");
          }
        }),
        catchError(this.#showErrors.bind(this)),
      )
  }

  #showErrors(res: any) {
    const details = res.error?.details as string[];
    for (const detail of details) {
      this.#toastrService.warning(detail, "Error");
    }
    return res;
  }

}
