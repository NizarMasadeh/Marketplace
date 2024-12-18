import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  getItem(itemName: any) {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(itemName);
    }
    return null;
  }

  setItem(itemName: any, itemValue: any) {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.setItem(itemName, itemValue);
    }
    return null;
  }

  removeItem(itemName: any) {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.removeItem(itemName);
    }
    return null;
  }

  clear() {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.clear();
    }
    return null;
  }
}
