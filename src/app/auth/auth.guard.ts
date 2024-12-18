import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);
  // const platform = inject(PLATFORM_ID);

  const token = window.localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    _router.navigate(['/login']);
    return false;
  }
};


//Injecting the PLATFORM_ID and then using if statement for isPlatFormBrowser... fixes the localstorage error for the SSR
//but you'll face some issues with the routing behavior where it routes to the login for a millisecond and then gets back
