import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';

@Component({
  selector: 'app-merchant-portal',
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    TabMenuModule,
    ToastModule,
    ConfirmPopupModule,
  ],
  templateUrl: './merchant-portal.component.html',
  styleUrl: './merchant-portal.component.scss',
  animations: [fadeAnimation]
})
export class MerchantPortalComponent implements AfterViewChecked {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  constructor(
    private _cdr: ChangeDetectorRef
  ) {}

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
