import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { MerchantService } from '../../../../services/merchant/merchant.service';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-add-product',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    StepperModule,
    ChipModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  providers: [MessageService]
})
export class AddProductComponent implements OnChanges {
  private isBrowser: boolean;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() productAdded = new EventEmitter<any>();

  stores: any;
  isLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _cdr: ChangeDetectorRef,
    private _merchantService: MerchantService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visible) {
      this.getStores()
    }
  }

  getStores() {
    this._merchantService.getMerchantStores().subscribe({
      next: (res: any) => {
        console.log("MErchant stores:", res);
        this.stores = res.stores;

      }, error: (error) => {
        console.error("Error fetching stores: ", error);

      }
    })
  }
  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onStore(store: any) {
    console.log("Selected this: ", store);

  }
}
