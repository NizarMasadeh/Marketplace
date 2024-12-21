import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

import { MerchantService } from '../../../../services/merchant/merchant.service';
import { ImagesService } from '../../../../services/images/images.service';
import { COUNTRIES } from '../../../../widgets/countries';
import { SkeletonModule } from 'primeng/skeleton';
import { fadeAnimation } from '../../../../widgets/animations/fade.animation';

interface Category {
  name: string;
  code: string;
  icon: string;
}

interface ProductSize {
  name: string;
  code: string;
}

@Component({
  selector: 'app-merchant-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    FileUploadModule,
    ToastModule,
    DialogModule,
    ChipModule,
    InputNumberModule,
    MultiSelectModule,
    SkeletonModule
  ],
  templateUrl: './merchant-add-product.component.html',
  styleUrls: ['./merchant-add-product.component.scss'],
  providers: [MessageService],
  animations: [fadeAnimation]
})
export class MerchantAddProductComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() productAdded = new EventEmitter<any>();

  productForm: FormGroup;

  selectedCountry: any;

  categories: Category[] = [
    { name: 'Fashion', code: 'FASHION', icon: 'fas fa-tshirt' },
    { name: 'Electronics', code: 'ELECTRONICS', icon: 'fas fa-tv' },
    { name: 'Home & Decor', code: 'DECOR', icon: 'fas fa-couch' },
    { name: 'Sports', code: 'SPORTS', icon: 'fas fa-football-ball' },
    { name: 'Kids', code: 'KIDS', icon: 'fas fa-child' },
    { name: 'Books', code: 'BOOKS', icon: 'fas fa-book' },
    { name: 'Health & Beauty', code: 'HEALTH_BEAUTY', icon: 'fas fa-heart' },
    { name: 'Automotive', code: 'AUTOMOTIVE', icon: 'fas fa-car' },
    { name: 'Groceries', code: 'GROCERIES', icon: 'fas fa-apple-alt' },
    { name: 'Travel', code: 'TRAVEL', icon: 'fas fa-plane' },
    { name: 'Music & Entertainment', code: 'MUSIC_ENT', icon: 'fas fa-guitar' },
    { name: 'Jewelry', code: 'JEWELRY', icon: 'fas fa-gem' },
    { name: 'Office Supplies', code: 'OFFICE', icon: 'fas fa-briefcase' },
  ];

  sizeOptions: ProductSize[] = [
    { name: 'Small', code: 'S' },
    { name: 'Medium', code: 'M' },
    { name: 'Large', code: 'L' },
    { name: 'XL', code: 'XL' }
  ];

  countries: any[] | undefined;
  mainImagePreview: string | null = null;

  isSubmitting = false;
  uploadingImages = false;

  uploadedImgsCount: number = 0;
  constructor(
    private fb: FormBuilder,
    private merchantService: MerchantService,
    private imagesService: ImagesService,
    private messageService: MessageService,
    private _cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]],
      countryOfOrigin: [null, Validators.required],
      sizes: [[], Validators.required],
      mainImage: ['', Validators.required],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      specifications: [''],
      tags: [[]]
    });
  }

  ngOnInit(): void {
    this.countries = COUNTRIES;
  }

  onCountryChange(event: any) {
    this.selectedCountry = event.value;

    this.productForm.get('countryOfOrigin')?.setValue(this.selectedCountry);
    console.log(this.productForm.value);
  }


  onMainImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingImages = true;

      this.imagesService.uploadImage(file).then(
        (uploadedUrl) => {
          this.mainImagePreview = uploadedUrl;
          this.productForm.get('mainImage')?.setValue(uploadedUrl);
          this.messageService.add({
            severity: 'success',
            summary: 'Image Uploaded',
            detail: 'Main image uploaded successfully'
          });
        },
        (error) => {
          this.uploadingImages = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload main image'
          });
        }
      );
    }
  }

  loadMainImg() {
    this.uploadingImages = false;
  }
  removeMainImage() {
    this.mainImagePreview = null;
    this.productForm.get('mainImage')?.setValue('');
    this._cdr.detectChanges();
  }

  onSubmit() {
    console.log('clicked');

    if (this.productForm.valid) {
      this.isSubmitting = true;

      const productData = this.productForm.value;

      this.merchantService.addProduct(productData).subscribe({
        next: (response) => {
          console.log("TS added: ", response);

          this.messageService.add({
            severity: 'success',
            summary: 'Product Added',
            detail: 'Product successfully added to catalog'
          });

          this.productAdded.emit(response);
          this.closeDialog();
        },
        error: (error) => {
          console.error("TS error", error);

          this.messageService.add({
            severity: 'error',
            summary: 'Add Product Failed',
            detail: 'Could not add product. Please try again.'
          });
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
    this.visibleChange.emit(false);
  }

  resetForm() {
    this.productForm.reset();
    this.mainImagePreview = null;
  }

  get f() { return this.productForm.controls; }
}