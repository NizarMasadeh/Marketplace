import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService implements OnInit{
  private isBrowser: boolean;

  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable()
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {

  }

  checkTheme() {
    if(this.isBrowser) {
      const theme = localStorage.getItem('theme');
      if(theme === 'dark') {
        this.isDarkModeSubject.next(true);
      } else {
        this.isDarkModeSubject.next(false);
      }
    }
  }

  toggleDarkMode() {
    const currentMode = this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(!currentMode);
  }
}
