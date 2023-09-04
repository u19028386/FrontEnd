import { Component } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  EmailAddress: string = '';
  validationErrors: string[] = [];
  isEmailSent = false;
  registerFormGroup: FormGroup = this.fb.group({
    EmailAddress: ['', [Validators.required, Validators.email]],
  })


  constructor(private apiService: APIService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    
}
  forgotPassword() {
    const payload = {
      EmailAddress: this.EmailAddress
    };
    this.apiService.forgotPassword(payload)
    .subscribe(
      () => {
        console.log('Password reset token sent successfully');
        this.router.navigate(['/password-reset']);
        // Handle success (e.g., show a success message)
      },
      error => {
        console.error('Failed to send password reset token', error);
        // Handle error (e.g., show an error message)
        if (error.status === 400 && error.error && error.error.errors) {
          const validationErrors = error.error.errors;
          // Process and display the validation errors as needed
        }
      }
    );
}
}
