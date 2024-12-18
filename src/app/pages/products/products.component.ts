import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _httpClient: HttpClient,

  ) {}

  ngOnInit(): void {

  }


  getProducts() {
    this._httpClient.get(`${environment.server}products`).subscribe(
      (res: any) => {
        console.log("Products: ", res);
        this.products = res.products;
        
      }
    )
  }
}
