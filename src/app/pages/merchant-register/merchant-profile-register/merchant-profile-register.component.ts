import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MerchantService } from '../../../services/merchant/merchant.service';
import { ImagesService } from '../../../services/images/images.service';
import { MessageService } from 'primeng/api';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService } from '../../../auth/auth.service';
import { COUNTRIES } from '../../../widgets/countries';

@Component({
  selector: 'app-merchant-profile-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FloatLabelModule,
    ToastModule,
    SkeletonModule
  ],
  templateUrl: './merchant-profile-register.component.html',
  styleUrl: './merchant-profile-register.component.scss',
  providers: [MessageService, AuthService],
  animations: [fadeAnimation]
})
export class MerchantProfileRegisterComponent implements OnInit {
  private isBrowser: boolean;

  registerForm: FormGroup = new FormGroup({
    pfp_img: new FormControl('', Validators.required),
    bg_img: new FormControl('', Validators.required),
    commercial_number: new FormControl('', Validators.required),
    national_number: new FormControl('', Validators.required),
    country: new FormControl([], Validators.required)
  })

  selectedPfp: File | null = null;
  previewPfp: any;
  pfpImg: any;

  selectedBg: File | null = null;
  previewBg: any;
  bgImg: any;

  countries: any[] = [];
  selectedCountry: any;

  errorMessage: string | null = null;

  isPfpImgUploading = false;
  isBgImgUploading = false;
  isRegistering = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _merchantService: MerchantService,
    private _imagesService: ImagesService,
    private _cdr: ChangeDetectorRef,
    private _messageService: MessageService,
    private _authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if(this.isBrowser) {
      this.countries = COUNTRIES;
    }
  }

  onPfpImgUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isPfpImgUploading = true;
      this._imagesService.uploadImage(file).then(
        (uploadedUrl) => {
          this.previewPfp = uploadedUrl;
          this.registerForm.get('pfp_img')?.setValue(uploadedUrl);
          this._messageService.add({
            severity: 'success',
            summary: 'Image Uploaded',
            detail: 'Profile image uploaded successfully'
          });          
        },
        (error) => {
          this.isPfpImgUploading = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload profile image'
          });
        }
      );
    }
  }

  onBgImgUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isBgImgUploading = true;

      this._imagesService.uploadImage(file).then(
        (uploadedUrl) => {
          this.previewBg = uploadedUrl;
          this.registerForm.get('bg_img')?.setValue(uploadedUrl);
          this._messageService.add({
            severity: 'success',
            summary: 'Image Uploaded',
            detail: 'Background image uploaded successfully'
          });
        },
        (error) => {
          this.isBgImgUploading = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: 'Failed to upload background image'
          });
        }
      );
    }
  }

  loadPfpImage() {
    this.isPfpImgUploading = false;
  }

  removePfpImage() {
    this.previewPfp = null;
    this.registerForm.get('pfpImg')?.setValue('');
    this._cdr.detectChanges();
  }
  
  loadBgImage() {
    this.isBgImgUploading = false;
  }

  removeBgImage() {
    this.previewBg = null;
    this.registerForm.get('BgImg')?.setValue('');
    this._cdr.detectChanges();
  }

  onCountryChange(event: any) {

    this.selectedCountry = event.value;
    console.log(this.selectedCountry);

    this.registerForm.get('country')?.setValue(this.selectedCountry);
  }

  isFormValid() {
    return this.registerForm.invalid;
  }

  onSubmit() { 
    console.log(this.registerForm.value);
    
    this._authService.onMerchantRegister(this.registerForm.value).subscribe();


    // this._authService.onMerchantRegister(this.registerForm.value).subscribe();
  }


}
