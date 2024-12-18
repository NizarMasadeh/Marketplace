import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MerchantService } from '../services/merchant/merchant.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient,
    private _router: Router,
    private _messageService: MessageService,
    private _merchantService: MerchantService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  private getHeaders(): HttpHeaders {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  onLogin(loginForm: any): Observable<any> {

    return this._httpClient.post(`${environment.serverAuth}login`, loginForm).pipe(
      tap({
        next: (res: any) => {
          const User = res.user;
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', User.id);
          localStorage.setItem('userType', User.userType);
          localStorage.setItem('email', User.email);
          localStorage.setItem('theme', User.theme);
          localStorage.setItem('fullName', User.fullName);
          localStorage.setItem('userStatus', User.status);

          const userType = localStorage.getItem('userType');
          const userStatus = localStorage.getItem('userStatus');

          if (userType === 'merchant') {
              this._merchantService.getMerchantProfile().subscribe(
                (res: any) => {
                  console.log("Merchant profile data: ", res);
                  
                  if (res.merchants.length === 0) {
                    this._router.navigate(['/merchant-profile-register'])
                  } else {
                    localStorage.setItem('fullName', res.merchants[0].full_name);
                    localStorage.setItem('merchantStatus', res.merchants[0].status);
                    this._router.navigate(['/merchant/dashboard']);
                  }
                  console.log("Merchant profile data: ", res);

                }
              )
            } else {
              localStorage.setItem('fullName', res.full_name);
              this._router.navigate(['/merchant/dashboard']);
            }
          this.isAuthenticatedSubject.next(true);

          this._messageService.add({
            severity: 'success',
            summary: 'Logged in'
          });

        }, error: (error) => {
          console.error('Error during login:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error.error?.message || 'Check your email and password.'
          });
        }
      })
    );
  }

  onRegister(registerForm: any): Observable<any> {
    return this._httpClient.post(`${environment.serverAuth}register`, registerForm).pipe(
      tap({
        next: (res: any) => {
          console.log("successfully registered: ", res);
        }, error: (error) => {
          console.error("Error stuff: ", error);
        }
      })
    )
  }

  onMerchantRegister(registerForm: any): Observable<any> {
    const merchantId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');

    const merchantForm = {
      ...registerForm,
      email: email,
      full_name: fullName,
      status: 'Pending'
    };

    const updateUserStatus = {
      status: 'Active'
    };

    return this._httpClient.post(`${environment.server}merchants/profile`, merchantForm, { headers: this.getHeaders() }).pipe(
      tap((res: any) => {
        console.log("Merchant registered: ", res);
      }),
      switchMap(() =>
        this._httpClient.patch(`${environment.server}users/profile?id=${merchantId}`, updateUserStatus, { headers: this.getHeaders() }).pipe(
          tap((res: any) => {
            localStorage.setItem('userStatus', 'Active');
            localStorage.setItem('merchantStatus', 'Pending');

            console.log("Merchant user status updated: ", res);
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Merchant completed registration!'
            });
          }),
          catchError((error) => {
            console.error("Error updating status, deleting merchant profile...", error);

            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error registering merchant!'
            });

            return this._httpClient.delete(`${environment.server}users/profile?id=${merchantId}`, { headers: this.getHeaders() }).pipe(
              tap(() => {
                console.log("Deleted user profile due to error.");
              }),
              catchError((deleteError) => {
                console.error("Error deleting user: ", deleteError);
                return of(null); // Ensure observable completion
              })
            );
          })
        )
      ),
      catchError((error) => {
        console.error("Error registering merchant: ", error);

        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Server error, try again later!'
        });

        return throwError(() => error); // Rethrow to propagate error downstream
      })
    );
  }

  onLogout(): Observable<any> {
    return this._httpClient.post(`${environment.serverAuth}logout`, {}, { headers: this.getHeaders() }).pipe(
      tap({
        next: (res: any) => {
          localStorage.clear();
          console.log("Logged out: ", res);
          this.isAuthenticatedSubject.next(false);
          this._router.navigate(['/home']);
        }, error: (error) => {
          localStorage.clear();
          console.log("Logged out: ");
          this.isAuthenticatedSubject.next(false);
          this._router.navigate(['/home']);
          console.error("Error stuff: ", error);
        }
      })
    )
  }

  async updateAuthState(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
