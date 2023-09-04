import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { APIService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/user-store.service';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;

  isLoading:boolean = false;
  email: string = '';
  isEmailSent = false;
  userData: any;
  userRole: string = '';
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(private router: Router, 
    private apiService: APIService, 
    private fb: FormBuilder, 
    private snackBar: MatSnackBar, 
    private toastr: NgToastService, 
    private userStore: UserStoreService,
    private resetPasswordService: ResetPasswordService) {
    localStorage.clear();
   }
  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      // FirstName: ['', Validators.required],
      // LastName: ['', Validators.required],
      EmailAddress: ['', Validators.required],
      Password: ['', Validators.required]
    })
  }
  hideShowPassword()
  {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSubmit() {
    if (this.loginFormGroup.valid) {
      this.apiService.Login(this.loginFormGroup.value).subscribe({
        next: (res) => {
          this.toastr.success({ detail: "SUCCESS", summary: res.message, duration: 5000 });
          this.loginFormGroup.reset();
          this.apiService.storeToken(res.token);
          const tokenPayload = this.apiService.decodeJwtToken();
          this.userStore.setFullName(tokenPayload.unique_name);
          this.userStore.setRole(tokenPayload.role);
          this.router.navigate(['project-manager']);
        },
        error: (err) => {
          console.error('Error response:', err);
  
          if (err?.error?.errors) {
            // Display the validation errors from the response
            console.log('Validation errors:', err.error.errors);
          }
          if (err?.error?.message) {
            // Display the error message from the API in Toastr
            this.toastr.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
          }
          else{
            this.toastr.error({ detail: "ERROR", summary: "Please contact IT support!", duration: 5000 });
          }
          
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginFormGroup);
      this.toastr.error({ detail: "ERROR", summary: "Please make sure all fields are entered!", duration: 5000 });
    }
  }
  checkValidEmail(event: string)
  {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  confirmToSend()
  {
    if(this.checkValidEmail(this.resetPasswordEmail))
    {
      console.log(this.resetPasswordEmail);
    }
    this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
    .subscribe({
      next:(res)=>{
        this.toastr.success({
          detail: "Success",
          summary: "Reset success!",
          duration: 3000,
        });
        this.resetPasswordEmail = "";
        const buttonRef = document.getElementById("closeBtn");
        buttonRef?.click();
      },
      error:(err)=>{
        console.log(err.message);
        this.toastr.error({
          detail: "Error",
          summary: "Something went wrong",
          duration: 3000,
        });
      }     

    })
  }

  


}
