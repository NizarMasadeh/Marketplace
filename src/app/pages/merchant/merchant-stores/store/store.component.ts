import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { fadeAnimation } from '../../../../widgets/animations/fade.animation';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MerchantService } from '../../../../services/merchant/merchant.service';
import { ImagesService } from '../../../../services/images/images.service';

@Component({
  selector: 'app-store-of-merchant',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SkeletonModule,
    MenubarModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
  providers: [MessageService, ConfirmationService],
  animations: [fadeAnimation]
})
export class StoreComponent implements OnChanges {
  private isBrowser: boolean;
  @Input() storeId: any;
  @Input() showStore = false;
  @Output() storeEdited = new EventEmitter<boolean>();
  @Output() noStoreEdits = new EventEmitter<boolean>();


  store: any;
  items: MenuItem[] | undefined;


  isLoading = false;
  logoImg: string | null = null;
  uploadingLogo = false;

  bgImg: string | null = null;
  uploadingBg = false;
  logoImageLoaded = false;
  bgImageLoaded = false;
  isTextLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _merchantService: MerchantService,
    private _imagesService: ImagesService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      if (changes['storeId'] && this.showStore) {
        console.log("Triggered");

        this.getStore();
      }
    }
  }
  getStore() {
    this.isLoading = true;

    this._merchantService.getStoreById(this.storeId).subscribe({
      next: (res: any) => {
        this.store = res.stores[0]
        this.loadMenuItems();
        this.isLoading = false;
        this._cdr.detectChanges();

      }, error: (error) => {
        console.error("Error fetching store: ", error);
        this.loadMenuItems();
        this.isLoading = false;
      }
    })
  }

  loadMenuItems() {
    this.items = [
      {
        label: 'Stores',
        icon: 'pi pi-shop',
        command: () => this.backToStores()
      },
      {
        label: 'Features',
        icon: 'pi pi-star'
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Components',
            icon: 'pi pi-bolt'
          },
          {
            label: 'Blocks',
            icon: 'pi pi-server'
          },
          {
            label: 'UI Kit',
            icon: 'pi pi-pencil'
          },
          {
            label: 'Templates',
            icon: 'pi pi-palette',
            items: [
              {
                label: 'Apollo',
                icon: 'pi pi-palette'
              },
              {
                label: 'Ultima',
                icon: 'pi pi-palette'
              }
            ]
          }
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope'
      },
      {
        label: 'Delete store',
        icon: 'pi pi-trash',
        command: () => this.onDeleteStore()
      },
    ]
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
              this.getStore();
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
              this.getStore();
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

  onDeleteStore() {
    this._confirmationService.confirm({
      message: `Are you sure that you want to <b>Delete</b> ${this.store.name}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {


        this._merchantService.deleteStore().subscribe({
          next: () => {
            this.isLoading = true;
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${this.store.name} was deleted!`
            })

            this.getStore();
          },
          error: (error) => {
            console.error("Error deletin store: ", error);
            this.isLoading = true;
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting store!'
            })
          }
        });
      }
    });
  }

  backToStores() {
    this.showStore = false;
    this.noStoreEdits.emit();
    this.storeId = null;
    this.store = null;
  }
}
