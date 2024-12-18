import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  headers: any;

  constructor(
    private _httpClient: HttpClient,
    private _localStorage: LocalstorageService
  ) {}

  getProducts(): Observable<any> {
    return this._httpClient.get(`${environment.server}products`).pipe(
      tap(
        () => {
          
        }
      )
    )
  }

  getMerchantProducts(): Observable<any> {
    const token = this._localStorage.getItem('token')
    const merchantId = this._localStorage.getItem('userId')
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })  
    
    return this._httpClient.get(`${environment.server}products/merchant?merchant_id=${merchantId}`, { headers })
  }
}
