import { ChangeDetectorRef, Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { fadeAnimation } from '../../widgets/animations/fade.animation';
import { AdminPortalComponent } from "./admin-portal/admin-portal.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin',
  imports: [
    AdminPortalComponent, 
    SidenavComponent,
    CommonModule,
    ToastModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [MessageService],
  animations: [fadeAnimation]
})

export class AdminComponent implements OnInit {
  private isBrowser: boolean;
  #document = inject(DOCUMENT);

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {
    if(this.isBrowser) {
      const theme = localStorage.getItem('theme');
      const linkElement = this.#document.getElementById(
        'app-theme',
      ) as HTMLLinkElement;

      if(theme) {
        if(theme === 'light') {
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
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed
  }
}