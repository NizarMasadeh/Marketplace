import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { fadeAnimation } from '../../widgets/animations/fade.animation';
import { AuthService } from '../../auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
    ToastModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
  animations: [fadeAnimation]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isRegistering = false;

  constructor(
    private _messageService: MessageService,
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      userType: new FormControl('customer'),
      password: new FormControl('', [
        Validators.required,
        this.passwordComplexityValidator()
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.passwordMatchValidator()
      ])
    });

    // Add a listener to revalidate confirm password when password changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
  }
  // Custom validator for password complexity
  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const lengthValid = value && value.length >= 6;
      const numberValid = /\d/.test(value);
      const specialCharValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      return lengthValid && numberValid && specialCharValid
        ? null
        : {
          passwordComplexity: {
            lengthValid,
            numberValid,
            specialCharValid
          }
        };
    };
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.registerForm?.get('password')?.value;
      const confirmPassword = control.value;

      return password === confirmPassword ? null : { 'passwordMismatch': true };
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isFormValid() {
    return this.registerForm.invalid;
  }

  onSubmit() {
    this.isRegistering = true;

    const theme = localStorage.getItem('theme');

    const registerData = {
      ...this.registerForm.value,
      theme: theme
    }

    this._authService.onRegister(registerData).subscribe({
      next: () => {
        this.registerForm.reset();
        this.isRegistering = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registered successfully!',
        })

        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 1300);
      }, error: () =>   {
        this.isRegistering = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something wrong happened!',
        })
      }
    })
  }
}
