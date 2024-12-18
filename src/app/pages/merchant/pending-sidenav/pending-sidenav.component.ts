import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-pending-sidenav',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule
  ],
  templateUrl: './pending-sidenav.component.html',
  styleUrl: './pending-sidenav.component.scss'
})
export class PendingSidenavComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()

  isBrowser: boolean;
  isLoggingOut = false;
  isAuthenticated = false;

  userName: any;
  userType: any;
  token: any;

  collapsed = false;
  screenWidth = 0;

  navData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  ngOnInit(): void {
    if(this.isBrowser) {
      this.loadNavData();
    this.screenWidth = window.innerWidth;
    }
  }

  loadNavData() {

    //MAKE THEM DISABLED AND SHOW A MESSAGE THAT HE HAS TO BE ACTIVATED BY THE ADMIN BEFORE CREATING A STORE

    this.navData = [
      {
        routerLink: 'dashboard',
        icon: 'pi pi-chart-bar',
        label: 'Dashboard'
      },
      {
        routerLink: 'store',
        icon: 'pi pi-shop',
        label: 'Store'
      },
      // {
      //   routerLink: 'products',
      //   icon: 'pi pi-box',
      //   label: 'Products'
      // },
      // {
      //   routerLink: 'messages',
      //   icon: 'pi pi-inbox',
      //   label: 'Messages'
      // },
      // {
      //   routerLink: 'settings',
      //   icon: 'pi pi-cog',
      //   label: 'Settings'
      // }
    ];
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSideNav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  logout() {
    this.isLoggingOut = true;

    this._authService.onLogout().subscribe(
      () => {
        this.isLoggingOut = false;
      }, (error) => {
        console.error("Error logging out: ", error);
        this.isLoggingOut = false;
      }
    )
  }
}