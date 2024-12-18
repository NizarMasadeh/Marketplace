import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MerchantService } from '../../../services/merchant/merchant.service';
import { MerchantCreateStoreComponent } from "../dialogs/merchant-create-store/merchant-create-store.component";
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { ImagesService } from '../../../services/images/images.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-merchant-store',
  imports: [
    CommonModule,
    ButtonModule,
    MerchantCreateStoreComponent,
    DialogModule,
    SkeletonModule,
    ToastModule
  ],
  templateUrl: './merchant-store.component.html',
  styleUrl: './merchant-store.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService]
})
export class MerchantStoreComponent implements OnInit {

  stores: any;
  createStoreDialog = false;
  bgImageLoaded = false;
  logoImageLoaded = false;
  isTextLoading = false;

  isLoading = false;
  isBrowser: boolean;
  isServer: boolean;

  logoImg: string | null = null;
  uploadingLogo = false;

  bgImg: string | null = null;
  uploadingBg = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _merchantService: MerchantService,
    private _cdr: ChangeDetectorRef,
    private _imagesService: ImagesService,
    private _messageService: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit() {
    this.getStores();
  }

  getStores() {
    this.isLoading = true;
    this.isTextLoading = true;

    if (this.isBrowser) {
      this._merchantService.getMerchantStores().subscribe(
        (res: any) => {
          console.log(res);

          if (res && res.stores && res.stores.length > 0) {
            this.stores = res.stores[0];
            localStorage.setItem('storeId', this.stores.id)
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

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingLogo = true;

      this._imagesService.uploadImage(file).then(
        (uploadedUrl) => {
          this.logoImg = uploadedUrl;

          const logoImg = {
            store_logo: this.logoImg
          }

          this._merchantService.updateStore(logoImg).subscribe(
            () => {
              this.getStores();
              this.uploadingLogo = false;
              this._messageService.add({
                severity: 'success',
                summary: 'Image Uploaded',
                detail: 'Logo image changed'
              });
            }, (error) => {
              console.error("Error updating store logo: ", error);
              this.uploadingLogo = false;
              this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error updating store!'
              });
            }
          )
        },
        (error) => {
          console.error("Error uploading image: ", error);
          this.uploadingLogo = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload main image'
          });
        }
      );
    }
  }

  onBgUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingBg = true;

      this._imagesService.uploadImage(file).then(
        (uploadedUrl) => {
          this.bgImg = uploadedUrl;

          const bgImg = {
            store_bg: this.bgImg
          }

          this._merchantService.updateStore(bgImg).subscribe(
            () => {
              this.getStores();
              this.uploadingBg = false;
              this._messageService.add({
                severity: 'success',
                summary: 'Image Uploaded',
                detail: 'Backgroung image changed'
              });
            }, (error) => {
              console.error("Error updating store backgroung: ", error);
              this.uploadingBg = false;
              this._messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error updating store!'
              });
            }
          )
        },
        (error) => {
          console.error("Error uploading image: ", error);
          this.uploadingBg = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload main image'
          });
        }
      );
      this._cdr.detectChanges();
    }
  }
  onBgImageLoad() {
    this.bgImageLoaded = true;
    this._cdr.detectChanges();
  }

  onLogoImageLoad() {
    this.logoImageLoaded = true;
    this._cdr.detectChanges();
  }

  onCreateStore() {
    this.createStoreDialog = true;
  }
}

