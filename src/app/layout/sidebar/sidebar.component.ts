import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  children?: MenuItem[];
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Input() sideBarVisible: boolean = false;
  @Output() isSideBarHidden = new EventEmitter<void>();

  private isAuthSupscription: Subscription | undefined;
  private _unsubscribeAll: Subject<void> = new Subject<void>()
  private isBrowser: boolean;
  private isServer: boolean;

  isLoggingOut = false;
  isAuthenticated = false;

  isCustomer = false;
  isAdmin = false;
  isMerchant = false;

  userName: any;
  userType: any;
  token: any;

  noUserMenuItems: MenuItem[] = [
    {
      label: 'Login',
      icon: 'pi pi-user',
      action: () => this.onLogin()
    },
    {
      label: 'Register',
      icon: 'pi pi-user-plus',
      action: () => this.onRegister()
    },
    {
      label: 'Register as a merchant',
      icon: 'pi pi-user-plus',
      action: () => this.onMerchantRegister()
    }
  ];

  customerMenuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/home'
    },
    {
      label: 'Favorites',
      icon: 'pi pi-heart',
      route: '/favorites'
    },
    {
      label: 'Wishlist',
      icon: 'pi pi-sparkles',
      route: '/wishlist'
    },
    {
      label: 'History',
      icon: 'pi pi-history',
      route: '/history'
    },
    {
      label: 'Become a merchant!',
      icon: 'pi pi-check-circle',
      route: '/merchant-register'
    }
  ];

  merchantMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/merchant/dashboard'
    },
    {
      label: 'Store',
      icon: 'pi pi-home',
      route: '/merchant/store'
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      route: '/merchant/products'
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-line',
      children: [
        {
          label: 'Revenue',
          icon: 'pi pi-chart-line',
          children: [
            {
              label: 'View',
              icon: 'pi pi-table',
              route: '/merchant/reports/revenue/view'
            },
            {
              label: 'Search',
              icon: 'pi pi-search',
              route: '/merchant/reports/revenue/search'
            }
          ]
        },
        {
          label: 'Expenses',
          icon: 'pi pi-chart-line',
          route: '/merchant/reports/expenses'
        }
      ]
    },
    {
      label: 'Team',
      icon: 'pi pi-users',
      route: '/merchant/team'
    },
    {
      label: 'Messages',
      icon: 'pi pi-comments',
      route: '/merchant/messages',
      badge: 3
    },
    {
      label: 'Calendar',
      icon: 'pi pi-calendar',
      route: '/merchant/calendar'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/merchant/settings'
    }
  ];

  adminMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/admin/dashboard'
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      route: '/admin/products'
    },
    {
      label: 'Merchants',
      icon: 'pi pi-users',
      route: '/admin/merchants'
    },
    {
      label: 'Messages',
      icon: 'pi pi-comments',
      route: '/admin/messages',
      badge: 3
    },
    {
      label: 'Calendar',
      icon: 'pi pi-calendar',
      route: '/admin/dashboard'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/admin/settings'
    }
  ];

  get menuItems(): MenuItem[] {
    if (!this.isAuthenticated) return this.noUserMenuItems;
    if (this.isCustomer) return this.customerMenuItems;
    if (this.isMerchant) return this.merchantMenuItems;
    if (this.isAdmin) return this.adminMenuItems;
    return [];
  }

  constructor(
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit(): void {

    if (this.isBrowser) {
      this.isAuthSupscription = this._authService.isAuthenticated$.subscribe(
        res => {
          this.isAuthenticated = res;
          this.checkUser();
          this._cdr.detectChanges();
        }
      )

      this.checkUser();
      this._cdr.detectChanges();
    }
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  checkUser() {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
      this.userType = localStorage.getItem('userType');
      this.userName = localStorage.getItem('fullName');

      if (this.isAuthenticated) {
        if (this.userType === 'admin') {
          this.isAdmin = true;
          this.isCustomer = false;
          this.isMerchant = false;
        }
        if (this.userType === 'merchant') {
          this.isMerchant = true;
          this.isAdmin = false;
          this.isCustomer = false;
        }
        if (this.userType === 'customer') {
          this.isCustomer = true;
          this.isAdmin = false;

          this.isMerchant = false;
        }
        this._cdr.detectChanges()
      }
    }
  }

  onMenuItemClick(item: MenuItem) {
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.onHide();
      this._router.navigate([item.route]);
    }
  }

  onLogin() {
    this.onHide();
    this._router.navigate(['/login']);
  }

  onRegister() {
    this.onHide();
    this._router.navigate(['/register']);
  }

  onMerchantRegister() {
    this.onHide();
    this._router.navigate(['/merchant-register']);
  }

  onLogout() {
    this.isLoggingOut = true;

    this._authService.onLogout().subscribe(
      () => {
        this.isLoggingOut = false;
        this.isCustomer = false;
        this.isAdmin = false;
        this.isMerchant = false;
        this.checkUser();
        this.onHide();
      }, () => {
        this.isLoggingOut = false;
      }
    );
    this._cdr.detectChanges();
  }

  onHide() {
    this.isSideBarHidden.emit();
    this.sideBarVisible = false;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this.isAuthSupscription) {
      this.isAuthSupscription.unsubscribe();
      this.userName = null;
      this.userType = null;
      this.token = null;
      this._cdr.detectChanges();
    }
  }


  /************ROUTES************/

  /*******MERCHANTS*******/

  public MERCHANT_DASHBOARD = '/merchant/dashboard';
  public MERCHANT_STORE = '/merchant/store';
  public MERCHANT_PRODUCTS = '/merchant/products';
  public MERCHANT_SETTINGS = '/merchant/settings';
  public MERCHANT_ADD_PRODUCT = '/merchant/add-product';

  /***********************/


  /*******ADMIN*******/

  public ADMIN_DASHBOARD = '/admin/dashboard';
  public ADMIN_MERCHANTS = '/admin/merchants';
  public ADMIN_STORE = '/admin/stores';
  public ADMIN_PRODUCTS = '/admin/products';
  public ADMIN_MESSAGES = '/admin/messages';
  public ADMIN_SETTINGS = '/admin/settings';

  /***********************/
}
