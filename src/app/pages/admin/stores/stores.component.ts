import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { AdminService } from '../../../services/admin/admin.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-stores',
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    SkeletonModule
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService, ConfirmationService]
})
export class StoresComponent implements OnInit {

  private isBrowser: boolean;
  stores: any;
  status: string = '';
  isUpdating = false;
  isLoading = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _adminService: AdminService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {
    if(this.isBrowser) {
    this.getStores();
    }
  }

  getStores() {
    this.isLoading = true;
      this._adminService.getStores().subscribe(
        (res: any) => {
          console.log("All stores: ", res);
          this.stores = res.stores;
          this.isLoading = false;
          this._cdr.detectChanges();
        }, (error) => {
          console.error("Error stuff: ", error);
          this.isLoading = false;
        }
      )
  }

  onUpdateStore(store: any) {
    console.log("Selected: ", store);

    let statusText;
    if (store.status === 'Active') {
      statusText = 'Deactivate';
      this.status = 'InActive';
    } else {
      statusText = 'Activate';
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
        this.updateStore(store);
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
          this.getStores();
          this.isUpdating = false;

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
}
