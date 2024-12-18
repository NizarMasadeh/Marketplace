import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const plateformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(plateformId)
  if (isBrowser) {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');

    if (userType && token && fullName && email) {
      if (userType === 'admin') {
        return true;
      } else {
        _router.navigate(['/not-auth']);
        return false;
      }
    } else {
      _router.navigate(['/not-auth']);
      return false;
    }
  }
  return false;
};
