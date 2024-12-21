import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AdminService } from '../../../../services/admin/admin.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-store-data',
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
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  templateUrl: './store-data.component.html',
  styleUrl: './store-data.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class StoreDataComponent implements OnChanges {
  private isBrowser: boolean;
  @Input() visible = false;
  @Input() storeId: any;
  @Output() storeEdited = new EventEmitter<boolean>();
  @Output() noStoreEdit = new EventEmitter<boolean>();

  store: any
  isLoading = false;
  isUpdating = false;
  status: any;
  storeUpdated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _adminService: AdminService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      if (changes['storeId'] && this.visible) {
        this.getStore();
      }
    }
  }

  getStore() {
    this.isLoading = true;
    this._adminService.getStoreById(this.storeId).subscribe({
      next: (res: any) => {
        console.log("Selected store: ", res);
        this.store = res.stores[0];
        this.isLoading = false;
      }, error: (error) => {
        console.error("Error fetching store: ", error);
        this.isLoading = false;
      }
    })
  }

  onUpdateStore() {

    let statusText;
    if (this.store.status === 'Active') {
      statusText == 'Deactivate';
      this.status = 'InActive';
    } else {
      statusText == 'Activate';
      this.status = 'Active'
    }

    this._confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.updateStore(this.store);
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

  updateStore(store: any) {
    this.isUpdating = true;
    let successMsg;

    const updatedStatus = {
      status: this.status
    }
    if (this.status = 'Active') {
      successMsg = 'Deactivated'
    } else {
      successMsg = 'Activated'
    }

    if (this.isBrowser) {
      this._adminService.updateStore(store.id, updatedStatus).subscribe(
        (res: any) => {
          console.log("Store successfully updated: ", res);
          this.getStore();
          this.isUpdating = false;
          this.storeUpdated = true;

          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${store.name} successfully ${successMsg}`,
            life: 4000
          })
          this.status = '';
        }, (error) => {
          this.isUpdating = false;
          console.error("Error updating: ", error);

          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating store!'
          })
        }
      )
      this._cdr.detectChanges();
    }
  }

  closeDialog() {
    if (this.storeUpdated) {
      this.storeEdited.emit();
      this.storeUpdated = false;
    }
    this.noStoreEdit.emit();

    this.visible = false;
  }
}
