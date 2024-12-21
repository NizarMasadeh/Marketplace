import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  private isBrowser: boolean;
  private isServer: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
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

  /******************MERCHANT INFO*************************/

  getMerchantProfile(): Observable<any> {
    if (this.isBrowser) {
      const merchantId = localStorage.getItem('userId');
      return this._httpClient.get(`${environment.server}merchants/profile?id=${merchantId}`, { headers: this.getHeaders() });
    }
    return of(null);
  }

  getMerchantUser(): Observable<any> {
    const merchantId = localStorage.getItem('userId');
    return this._httpClient.get(`${environment.server}users/profile?id=${merchantId}`, { headers: this.getHeaders() });
  }

  /********************************************************/


  /************************STORE****************************/


  createMerchantStore(storeForm: any): Observable<any> {
    if (this.isBrowser) {

      return this._httpClient.post(`${environment.server}stores`, storeForm, { headers: this.getHeaders() })
    }
    return of(null);
  }

  getMerchantStores(): Observable<any> {
    if (this.isBrowser) {
      const userId = localStorage.getItem('userId');
      return this._httpClient.get(`${environment.server}stores/merchant?id=${userId}`, { headers: this.getHeaders() });
    }
    return of(null);
  }

  getStoreById(storeId: any): Observable<any> {
    return this._httpClient.get(`${environment.server}stores?id=${storeId}`, { headers: this.getHeaders() });
  }

  updateStore(storeData: any): Observable<any> {
    if (this.isBrowser) {
      const storeId = localStorage.getItem('storeId');

      return this._httpClient.put(`${environment.server}stores?id=${storeId}`, storeData, { headers: this.getHeaders() });
    }
    return of(null);
  }

  deleteStoreById(storeId: any): Observable<any> {
    return this._httpClient.delete(`${environment.server}stores?id=${storeId}`, { headers: this.getHeaders() });
  }

  /********************************************************/


  /*********************PRODUCTS***************************/

  getMerchantProducts(): Observable<any> {
    // Check if the platform is browser-based
    if (this.isBrowser) {
      const merchantId = localStorage.getItem('userId');
      return this._httpClient.get(`${environment.server}products/merchant?merchant_id=${merchantId}`, { headers: this.getHeaders() });
    }
    return of(null);
  }

  addProduct(productForm: any): Observable<any> {

    if (this.isBrowser) {

      return this._httpClient.post(`${environment.server}products`, productForm, { headers: this.getHeaders() })
    }
    return of(null)
  }

  /********************************************************/
}