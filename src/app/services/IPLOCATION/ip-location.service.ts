import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { subscribe } from 'node:diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class IpLocationService {

  //IpUrl: https://api.ipify.org?format=json
  //locationByIp: 'http://ip-api.com/json/' //insert Ip after the slash
  //detailedLocation: 'http://ipwho.is/', //insert Ip after the slash
  //userAgent: 'https://api.ipgeolocation.io/user-agent?apiKey=8fa47f7f36f5437aa9d69bf5776e3cbe'
  
  normalLocation: any;
  detailedLocation: any;
  userAgent: any;
  allUserData: any[] = [];

  constructor(
    private _httpClient: HttpClient
  ) { }

  getIpAdress(): Observable<any> {
    return this._httpClient.get(`${environment.IpUrl}`);
  }

  getAllUserSENdata(): Observable<any> {
    return this._httpClient.get<any>(`${environment.IpUrl}`).pipe(
      switchMap((ipRes) => {
        const ipAddress = ipRes.ip;

        return forkJoin({
          normalLocation: this._httpClient.get<any>(`${environment.locationByIp}${ipAddress}`),
          detailedLocation: this._httpClient.get<any>(`${environment.detailedLocation}${ipAddress}`),
          userAgent: this._httpClient.get<any>(`${environment.userAgent}`)
        });
      }),
      map((response) => {
        const allUserData = {
          ...response.normalLocation,
          ...response.detailedLocation,
          ...response.userAgent
        };
        console.log("All combined user data: ", allUserData);
        return allUserData;
      })
    );
  }

  //FOR SSR 2 APIS HANDLED IN NODEJS
  getIpLocation_SSR(): Observable<any> {
    return this._httpClient.get(`${environment.server}ipLocation`);
  }

  getUserAgent(): Observable<any> {
    return this._httpClient.get(`${environment.userAgent}`);
  }
}
