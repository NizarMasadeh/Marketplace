import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { fadeAnimation } from '../../widgets/animations/fade.animation';
import { TabMenuModule } from 'primeng/tabmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { MerchantService } from '../../services/merchant/merchant.service';
import { MerchantPortalComponent } from "./merchant-portal/merchant-portal.component";
import { SidenavComponent } from './sidenav/sidenav.component';
import { PendingSidenavComponent } from "./pending-sidenav/pending-sidenav.component";
import { AuthService } from '../../auth/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-merchant',
  imports: [
    CommonModule,
    ButtonModule,
    TabMenuModule,
    ToastModule,
    ConfirmPopupModule,
    MerchantPortalComponent,
    SidenavComponent,
    PendingSidenavComponent,
    ProgressSpinnerModule
],
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss',
  animations: [fadeAnimation],
  providers: [ConfirmationService, MessageService]
})
export class MerchantComponent implements OnInit {
  private isBrowser: boolean;
  #document = inject(DOCUMENT);

  items: MenuItem[] | undefined;

  isSideNavCollapsed = false;
  screenWidth = 0;

  isActive: boolean | undefined;
  isPending: boolean | undefined;
  isInActive: boolean | undefined;
  error: boolean | undefined;

  isLoggingOut = false;
  isLoading = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _merchantService: MerchantService,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.isLoading = true;

      this._merchantService.getMerchantProfile().subscribe({
        next: (res: any) => {
          const merchantstat = res.merchants[0].status;
          if(merchantstat === 'Pending') {
            this.isPending = true;
          } else if(merchantstat === 'Active') {
            this.isActive = true;
          } else if(merchantstat === 'InActive') {
            this.isInActive = true;
          }
          this.isLoading = false;
        }, error: (error) => {
          console.log("Error fetching merchant profile", error);
          this.error = true;
          this.isLoading = false;
        }
      })
      this._cdr.detectChanges();



      const theme = localStorage.getItem('theme');
      const linkElement = this.#document.getElementById(
        'app-theme',
      ) as HTMLLinkElement;

      if (theme) {
        if (theme === 'light') {
          linkElement.href = 'theme-light.css';
        } else {
          linkElement.href = 'theme-dark.css';
        }
      } else {
        linkElement.href = 'theme-light.css';
        localStorage.setItem('theme', 'light');
      }
      this._cdr.detectChanges();
    }
  }

  getMerchantData() {
    if (this.isBrowser) {
      this._merchantService.getMerchantProfile().subscribe(
        (res: any) => {
          this._merchantService.getMerchantStores().subscribe(
            (storesRes: any) => {
              // Handle stores data if needed
            }
          );
        }
      );
    }
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed
  }

  onLogout() {
    this.isLoggingOut = true;
    this._authService.onLogout().subscribe({
      next: () => {
        this.isLoggingOut = false;
      }, error: () => {
        this.isLoggingOut = false;
      }
    });
  }
  // loadMenuBar() {
  //   this.items = [
  //     {
  //       label: 'Dashboard',
  //       icon: 'pi pi-home',
  //       routerLink: '/merchant/merchant-dashboard'
  //     },
  //     {
  //       label: 'Store',
  //       icon: 'pi pi-shop',
  //       routerLink: '/merchant/merchant-store'
  //     },
  //     {
  //       label: 'Products',
  //       icon: 'pi pi-box',
  //       routerLink: '/merchant/merchant-products'
  //     },
  //     {
  //       label: 'Messages',
  //       icon: 'pi pi-inbox',
  //       routerLink: '/merchant/merchant-messages'
  //     },
  //     {
  //       label: 'Settings',
  //       icon: 'pi pi-cog',
  //       routerLink: '/merchant/merchant-settings'
  //     }
  //   ];
  // }
}

