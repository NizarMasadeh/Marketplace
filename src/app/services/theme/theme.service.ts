import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isBrowser: boolean;
  private isServer: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
    this.isServer = isPlatformServer(this.platformId)
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

  updateTheme(theme: any): Observable<any> {
    if (this.isBrowser) {

      const userType = localStorage.getItem('userType');
      const userId = localStorage.getItem('userId');

      if (userType === 'merchant') {
        return this._httpClient.put(`${environment.server}merchants/profile?id=${userId}`, theme, { headers: this.getHeaders() })
      }

      if (userType === 'admin') {
        return this._httpClient.put(`${environment.server}admins?id=${userId}`, theme, { headers: this.getHeaders() })
      }
    }
    return of(null);
  }
}
