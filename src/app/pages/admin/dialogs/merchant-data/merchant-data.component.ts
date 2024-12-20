import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Input, Output, Inject, PLATFORM_ID, ChangeDetectorRef, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { fadeAnimation } from '../../../../widgets/animations/fade.animation';
import { AdminService } from '../../../../services/admin/admin.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-merchant-data',
  imports: [
    CommonModule,
    DialogModule,
    SkeletonModule,
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './merchant-data.component.html',
  styleUrl: './merchant-data.component.scss',
  providers: [MessageService, ConfirmationService],
  animations: [fadeAnimation]
})
export class MerchantDataComponent implements OnChanges {
  private isBrowser: boolean;
  @Input() visible = false;
  @Input() merchantData: any;

  @Output() updated = new EventEmitter<boolean>();
  @Output() visibleChange = new EventEmitter<boolean>();

  isLoading = false;
  isUpdating = false;

  merchant: any;
  status: any;
  statusText: any;
  successText: any;
  isMerchantUpdated = false;
  merchantStores: any;
  isStoresLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _adminService: AdminService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['merchantData'] && this.merchantData) {
      this.isLoading = true;
      this.getMerchantData();
    }
  }

  getMerchantData() {
    this.isLoading = true
    this._adminService.getMerchantById(this.merchantData.id).subscribe({
      next: (res: any) => {

        this.merchant = res.merchants[0];
        
        if(this.merchant.stores) {
        const merchantStoreId = res.merchants[0]?.stores[0]?.id
        this.getMerchantStore(merchantStoreId);
        } else {
          this.merchantStores = null;
        }

        this.isLoading = false;
        this._cdr.detectChanges();
      }, error: (error) => {
        console.error("Error fetching merchant data: ", error);
        this.isLoading = false;
      }
    })
  }

  onUpdateMerchant() {
    const merchantStatus = this.merchant.status;

    if (merchantStatus === 'Active') {
      this.status = 'InActive'
      this.statusText = 'Deactivate';
      this.successText = 'Deactivated';
    } else if (merchantStatus === 'Pending' || merchantStatus === 'InActive') {
      this.status = 'Active'
      this.statusText = 'Activate';
      this.successText = 'Activated';
    }

    this._confirmationService.confirm({
      message: `Are you sure that you want to <b>${this.statusText}</b> ${this.merchant.full_name}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.isLoading = true;
        this._cdr.detectChanges();
        this.isUpdating = true;
        this.merchant = null;

        this._adminService.updateMerchantStatus(this.merchantData.id, this.status).subscribe({
          next: () => {
            this.isLoading = true;
            this.isUpdating = false;
            this.isMerchantUpdated = true;
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${this.merchantData.full_name} got ${this.successText}`
            })

            this.getMerchantData();
          },
          error: (error) => {
            console.error("Error updating merchant status: ", error);
            this.isLoading = true;
            this.isUpdating = false;
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error updating merchant status!'
            })
          }
        });
      },
      reject: () => {
        this.isUpdating = false;
      }
    });
  }

  getMerchantStore(storeId: any) {
    this.isStoresLoading = true;
    this._adminService.getMerchantStore(storeId).subscribe({
      next: (res: any) => {
        console.log("Merchant store: ", res);
        this.merchantStores = res.stores;
        this.isStoresLoading = false;

      }, error: (error) => {
        console.error("Error fetching store: ", error);
        this.isStoresLoading = false;
      }
    })
  }
  closeDialog() {

    if (this.isMerchantUpdated) {
      this.updated.emit(true);
    }

    this.isMerchantUpdated = false;
    this.visible = false;
    this.merchant = null;
    this.visibleChange.emit(false);
  }
}
