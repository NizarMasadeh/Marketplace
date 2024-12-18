import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MerchantService } from '../../services/merchant/merchant.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantProductsResolver implements Resolve<any> {
  constructor(private merchantService: MerchantService) { }

  resolve() {
    return this.merchantService.getMerchantProducts(); // Ensure this is an Observable
  }
}
