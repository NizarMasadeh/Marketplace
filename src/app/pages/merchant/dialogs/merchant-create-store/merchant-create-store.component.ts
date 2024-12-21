import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MerchantService } from '../../../../services/merchant/merchant.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { fadeAnimation } from '../../../../widgets/animations/fade.animation';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ImagesService } from '../../../../services/images/images.service';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { COUNTRIES } from '../../../../widgets/countries';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';

interface Category {
  name: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-merchant-create-store',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    CardModule,
    ImageModule,
    MultiSelectModule,
    InputNumberModule
  ],
  templateUrl: './merchant-create-store.component.html',
  styleUrl: './merchant-create-store.component.scss',
  animations: [fadeAnimation],
  providers: [MessageService]
})

export class MerchantCreateStoreComponent implements OnInit {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() storeCreated = new EventEmitter<boolean>();

  storeForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    location: new FormControl([], Validators.required),
    store_logo: new FormControl('', Validators.required),
    store_bg: new FormControl('', Validators.required),
    reg_number: new FormControl('', Validators.required),
    categories: new FormControl([], Validators.required)
  });

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


  countries: any[] | undefined;
  selectedCountry: string | undefined;
  storeLogo: any;
  previewLogo: any;

  storeBg: any;
  previewStoreBg: any;

  selectedLogo: File | null = null;
  selectedBg: File | null = null;
  errorMessage: string | null = null;

  isImgUploading = false;

  isSubmiting = false;

  constructor(
    private _merchantService: MerchantService,
    private _messageService: MessageService,
    private _imagesService: ImagesService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.countries = COUNTRIES;
  }

  onCountryChange(event: any) {

    this.selectedCountry = event.value;
    console.log(this.selectedCountry);

    this.storeForm.get('location')?.setValue(this.selectedCountry);
  }

  onStoreLogoSelect(event: any) {

    const file = event.target.files[0];
    this.selectedLogo = file;
    if (file && file.type.startsWith('image/')) {
      // Check for duplicate images
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewLogo = reader.result as string;;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    this.uploadStoreLogo();
  }

  showForm() {
    console.log(this.storeForm.value);

  }
  onStoreBgSelect(event: any) {

    const file = event.target.files[0];
    this.selectedBg = file;
    if (file && file.type.startsWith('image/')) {
      // Check for duplicate images
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewStoreBg = reader.result as string;;
        this._cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
    this.uploadStoreBg();
  }

  async uploadStoreLogo() {
    this.isImgUploading = true;

    if (!this.selectedLogo) {
      this.errorMessage = 'Please select a file first';
      return;
    }
    try {
      // Reset previous states
      this.errorMessage = null;
      // Upload the image
      const uploadedUrl = await this._imagesService.uploadImage(this.selectedLogo);

      this.isImgUploading = false;

      // Log the upload for debugging
      this.storeLogo = uploadedUrl;

      this.storeForm.get('store_logo')?.patchValue(uploadedUrl);


    } catch (error: any) {
      this.errorMessage = error.response?.data?.error || 'Failed to upload image';
      console.error('Upload error:', error);
      this.isImgUploading = true;
    }
  }

  async uploadStoreBg() {
    this.isImgUploading = true;

    if (!this.selectedBg) {
      this.errorMessage = 'Please select a file first';
      return;
    }
    try {
      // Reset previous states
      this.errorMessage = null;
      // Upload the image
      const uploadedUrl = await this._imagesService.uploadImage(this.selectedBg);

      this.isImgUploading = false;

      // Log the upload for debugging
      this.storeBg = uploadedUrl;

      this.storeForm.get('store_bg')?.patchValue(uploadedUrl);


    } catch (error: any) {
      this.errorMessage = error.response?.data?.error || 'Failed to upload image';
      console.error('Upload error:', error);
      this.isImgUploading = true;
    }
  }

  removeStoreLogo() {
    this.storeLogo = null;
    this.previewLogo = null;
    this.storeForm.get('store_logo')?.patchValue('null');
    this._cdr.detectChanges();
  }

  removeStoreBg() {
    this.storeBg = null;
    this.previewStoreBg = null;
    this.storeForm.get('sotre_bg')?.patchValue('null');
    this._cdr.detectChanges();
  }

  // onBackgroundSelect(event: any) {
  //   this.storeBg = event.files[0];
  // }

  createStore() {
    this.isSubmiting = true;

    console.log(this.isSubmiting);


    const storeData = this.storeForm.value;


    this._merchantService.createMerchantStore(storeData).subscribe({
      next: (response) => {
        this.isSubmiting = false;
        console.log("Store created: ", response);

        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Store created successfully'
        });
        this.storeCreated.emit(false);
        this.closeDialog();
      },
      error: (error) => {
        this.isSubmiting = false;
        console.error("somthing wrong: ", error);

        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create store'
        });
      }
    });
  }

  closeDialog() {
    this.storeForm.reset();
    this.selectedCountry = '';
    this.storeLogo = null;
    this.storeBg = null;
    this.selectedLogo = null;
    this.selectedBg = null;
    this.visible = false;
    this.visibleChange.emit();
  }
}