import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { AdminService } from '../../../services/admin/admin.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { MerchantDataComponent } from "../dialogs/merchant-data/merchant-data.component";

@Component({
  selector: 'app-merchants',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    MerchantDataComponent
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

  status: any;
  statusText: string = '';
  successText: string = '';

  dialogVisible = false;
  selectedMerchant: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _adminService: AdminService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if(this.isBrowser) {
      this.getAllMerchants();
    }
  }

  getAllMerchants() {
    this.isLoading = true;
    this._adminService.getAllMerchants().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.merchants = res.merchants;
      }, error: (error) => {
        console.error("Error fetching merchants", error);
        this.isLoading = false;
      }
    })
  }

  onUpdateMerchant(merchant: any) {
    console.log("Clicked on this: ", merchant);
    const merchantStatus = merchant.status;
  
    if(merchantStatus === 'Active') {
      this.status = 'InActive'
      this.statusText = 'Deactivate';
      this.successText = 'Deactivated';
    } else if(merchantStatus === 'Pending' || merchantStatus === 'InActive') {
      this.status = 'Active'
      this.statusText = 'Activate';
      this.successText = 'Activated';
    } 
  
    this._confirmationService.confirm({
      message: `Are you sure that you want to <b>${this.statusText}</b> ${merchant.full_name}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.isLoading = true;
        this.merchants = [];
        this._cdr.detectChanges();
  
        this._adminService.updateMerchantStatus(merchant.id, this.status).subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${merchant.full_name} got ${this.successText}`
            })
            
            this.getAllMerchants();
          }, 
          error: (error) => {
            console.error("Error updating merchant status: ", error);
            this.isLoading = false;
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating merchant status!'
            })
          }
        });
      },
      reject: () => {
        this._messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000
        });
      }
    });
  }

  onMerchant(merchant: any) {
    this.selectedMerchant = merchant;
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
    this.selectedMerchant = null;
  }
}
