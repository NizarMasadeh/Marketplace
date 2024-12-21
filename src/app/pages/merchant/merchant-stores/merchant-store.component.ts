import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MerchantService } from '../../../services/merchant/merchant.service';
import { MerchantCreateStoreComponent } from "../dialogs/merchant-create-store/merchant-create-store.component";
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { ImagesService } from '../../../services/images/images.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import { StoreComponent } from './store/store.component';

@Component({
  selector: 'app-merchant-store',
  imports: [
    CommonModule,
    ButtonModule,
    MerchantCreateStoreComponent,
    DialogModule,
    SkeletonModule,
    ToastModule,
    MenubarModule,
    ConfirmDialogModule,
    ChipModule,
    StoreComponent
  ],
  templateUrl: './merchant-store.component.html',
  styleUrl: './merchant-store.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService, ConfirmationService]
})
export class MerchantStoreComponent implements OnInit {

  stores: any;
  createStoreDialog = false;
  isTextLoading = false;

  items: MenuItem[] | undefined;

  isLoading = false;
  isBrowser: boolean;
  isServer: boolean;

  showSelectedStore = false;
  selectedStoreId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _merchantService: MerchantService,
    private _cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit() {
    this.getStores();
  }

  closeDialog() {
    this.createStoreDialog = false;
  }

  getStores() {
    this.isLoading = true;
    this.isTextLoading = true;

    if (this.isBrowser) {
      this._merchantService.getMerchantStores().subscribe(
        (res: any) => {
          console.log("stores: ", res);

          if (res && res.stores && res.stores.length > 0) {
            this.stores = res.stores;
            // localStorage.setItem('storeId', this.stores.id)
            this.isTextLoading = false;
          } else {
            this.stores = null;
          }
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        (error) => {
          this.stores = null;
          this.isLoading = false;
          console.error('Error fetching stores:', error);
          this._cdr.detectChanges();
        }
      );
    }
  }

  onStore(store: any) {
    this.selectedStoreId = store.id;
    this.showSelectedStore = true;
  }

  closeStore() {
    this.selectedStoreId = null;
    this.showSelectedStore = false;
    this._cdr.detectChanges()
  }

  onCreateStore() {
    this.createStoreDialog = true;
  }
}

