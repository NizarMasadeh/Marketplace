import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';

@Component({
  selector: 'app-admin-portal',
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TabMenuModule,
    ToastModule,
    ConfirmPopupModule
  ],
  templateUrl: './admin-portal.component.html',
  styleUrl: './admin-portal.component.scss',
  animations: [fadeAnimation]
})
export class AdminPortalComponent implements OnInit, AfterViewChecked {

  private isBrowser: boolean;
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {

  }

  ngAfterViewChecked(): void {
    this._cdr.detectChanges();
  }
  
  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}