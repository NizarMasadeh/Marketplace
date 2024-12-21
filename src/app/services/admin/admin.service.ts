import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _httpClient: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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


  /***********************USERS*****************************/

  getAllUsers(): Observable<any> {
    return this._httpClient.get(`${environment.server}users`, { headers: this.getHeaders() });
  }

  getUserById(userId: any): Observable<any> {
    return this._httpClient.get(`${environment.server}users/profile?id=${userId}`, { headers: this.getHeaders() });
  }

  /***********************************************************/


  /***********************MERCHANTS*****************************/

  getAllMerchants(): Observable<any> {
    return this._httpClient.get(`${environment.server}merchants`, { headers: this.getHeaders() });
  }

  getMerchantById(merchantId: any): Observable<any> {
    return this._httpClient.get(`${environment.server}merchants/profile?id=${merchantId}`, { headers: this.getHeaders() });
  }

  updateMerchantStatus(merchantId: any, status: any): Observable<any> {
    const updatedData = {
      status: `${status}`
    }

    return this._httpClient.patch(`${environment.server}merchants/profile?id=${merchantId}`, updatedData, { headers: this.getHeaders() });
  }


  getMerchantStore(storeId: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this._httpClient.get(`${environment.server}stores?id=${storeId}`, { headers: this.getHeaders() });
  }

  /***********************************************************/


  /***********************STORES*****************************/

  getStores(): Observable<any> {
    return this._httpClient.get(`${environment.server}stores/all`, { headers: this.getHeaders() });
  }

  updateStore(storeId: any, storeData: any): Observable<any> {
    return this._httpClient.put(`${environment.server}stores?id=${storeId}`, storeData, { headers: this.getHeaders() });
  }

  getStoreById(storeId: any): Observable<any> {
    return this._httpClient.get(`${environment.server}stores?id=${storeId}`, { headers: this.getHeaders() });
  }
  /***********************************************************/



}
