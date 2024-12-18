import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MerchantService } from '../../../services/merchant/merchant.service';
import { MerchantAddProductComponent } from "../dialogs/merchant-add-product/merchant-add-product.component";
import { isPlatformBrowser } from '@angular/common';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-merchant-products',
  imports: [
    CommonModule,
    ButtonModule,
    MerchantAddProductComponent,
    SkeletonModule
  ],
  templateUrl: './merchant-products.component.html',
  styleUrl: './merchant-products.component.scss',
  animations: [fadeAnimation]
})
export class MerchantProductsComponent implements OnInit {

  products: any;
  addProductDialog = false;
  isBrowser: boolean;
  isLoading = false;
  isServer: boolean;

  constructor(
    private _merchantService: MerchantService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId)
  }

  ngOnInit(): void {
    this.getMerchantProducts();
  }

  getMerchantProducts() {
    this.isLoading = true;
    if (this.isBrowser) {
      this._merchantService.getMerchantProducts().subscribe(
        (res: any) => {
          this.products = res.products;
          console.log('Merchant products:', res);
          this.isLoading = false;
          this._cdr.detectChanges();
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching merchant products:', error);
        }
      );
    }
  }

  getProductsAfter() {
    if (this.isBrowser) {
      this._merchantService.getMerchantProducts().subscribe(
        (res: any) => {
          let updatedProducts = res.products;
          if (updatedProducts !== this.products) {
            this.isLoading = true;
            this.products === updatedProducts;
            this.isLoading = false;
          } else {
            return;
          }
        }
      )
    }
  }

  isNewProduct(product: any): boolean {
    if (!this.isBrowser) return false; // Skip this check on the server
    const createdDate = new Date(product.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }

  getSpecKeys(spec: any): string[] {
    return Object.keys(spec);
  }

  calculateOriginalPrice(price: number, discount: string): number {
    const discountPercent = parseFloat(discount);
    return Number((price / (1 - discountPercent / 100)).toFixed(2));
  }

  addProduct() {
    this.addProductDialog = true;
  }
}