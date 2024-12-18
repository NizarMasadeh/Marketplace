import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AdminService } from '../../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';

@Component({
  selector: 'app-merchants',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService, ConfirmationService]
})
export class MerchantsComponent implements OnInit {
  private isBrowser: boolean;

  merchants: any;
  isLoading = false;
  isUpdating = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _adminService: AdminService,
    private _messageService: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if(this.isBrowser) {
      this.getAllMerchants();
    }
  }

  getAllMerchants() {
    this._adminService.getAllMerchants().subscribe({
      next: (res: any) => {
        console.log("Merchants: ", res);
        this.merchants = res.merchants;
      }, error: (error) => {
        console.error("Error fetching merchants", error);
        
      }
    })
  }

  onUpdateMerchant(merchant: any) {
    console.log("Clicked on this: ", merchant);
    
  }
}
