import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../auth/auth.service';
import { Subject, Subscription } from 'rxjs';
// import { SidebarComponent } from "../sidebar/sidebar.component";
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { fadeAnimation } from '../../widgets/animations/fade.animation';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    ToastModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SidebarComponent,
    InputSwitchModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [fadeAnimation]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  private authSubscription: Subscription | undefined;
  private isBrowser: boolean;

  #document = inject(DOCUMENT);
  isDarkMode = false;
  isThemeLoading = false;

  items: MenuItem[] | undefined;

  isAuthenticated = false;
  sideBarVisible = false;
  isAdmin = false;
  isLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService,
    private _navbarService: NavbarService,
    private _themeService: ThemeService,
    private _router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.isThemeLoading = true;

    if (this.isBrowser) {
      this._navbarService.checkTheme();

      const theme = localStorage.getItem('theme');
      const linkElement = this.#document.getElementById(
        'app-theme',
      ) as HTMLLinkElement;

      if (theme) {
        if (theme === 'light') {
          linkElement.href = 'theme-light.css';
          this.isDarkMode = false;
          this.isThemeLoading = false;
        } else {
          linkElement.href = 'theme-dark.css';
          this.isDarkMode = true;
          this.isThemeLoading = false;
        }
      } else {
        linkElement.href = 'theme-light.css';
        this.isDarkMode = false;
        this.isThemeLoading = false;
        localStorage.setItem('theme', 'light');
      }
      this._cdr.detectChanges();
    }

    this.authSubscription = this._authService.isAuthenticated$.subscribe(
      res => {
        this.isAuthenticated = res;
        this.loadMenuItems();
        this._cdr.detectChanges()
      }
    )

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (token && userType) {
        this._authService.updateAuthState(true);
      }
      if (userType === 'admin') {
        this.isAdmin = true;
      }
    }
  }

  goHome() {
    this._router.navigate(['/home'])
  }
  toggleLightDark() {
    if (this.isBrowser) {
      this._navbarService.toggleDarkMode()
      this._navbarService.isDarkMode$.subscribe(
        res => {
          if (res === true) {
            this.isDarkMode = true;
          } else {
            this.isDarkMode = false;
          }
          this._cdr.detectChanges()
        }
      )

      const linkElement = this.#document.getElementById(
        'app-theme',
      ) as HTMLLinkElement;
      if (linkElement.href.includes('light')) {
        linkElement.href = 'theme-dark.css';
        localStorage.setItem('theme', 'dark');
      } else {
        linkElement.href = 'theme-light.css';
        localStorage.setItem('theme', 'light');
      }

      const theme = localStorage.getItem('theme');
      const updatedTheme = {
        theme: theme
      }
      this._themeService.updateTheme(updatedTheme).subscribe();
    }
  }

  loadMenuItems() {

    if (isPlatformBrowser(this.platformId)) {

      const userType = localStorage.getItem('userType');

      if (this.isAuthenticated && userType == 'admin') {
        this.isAdmin = true;
        this._cdr.detectChanges();
      } else {
        this.isAdmin = false;
        this._cdr.detectChanges();
      }

      if (this.isAuthenticated) {
        this.items = [
          {
            label: 'User',
            items: [
              {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.onLogout()
              }
            ]
          }
        ];
      } else {
        this.items = [
          {
            label: 'User',
            items: [
              {
                label: 'Login',
                icon: 'pi pi-key',
                routerLink: ['/login']
              },
              {
                label: 'Register',
                icon: 'pi pi-user-plus',
                routerLink: ['/register']
              }
            ]
          }
        ];
      }
    }

    this._cdr.detectChanges();
  }

  showSideBar() {
    this.sideBarVisible = true;
  }

  hideSideBar() {
    this.sideBarVisible = false;
  }
  onLogout() {
    this._authService.onLogout().subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this._cdr.detectChanges()
    }
  }
}
