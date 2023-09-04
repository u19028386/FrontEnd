import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { TitleModel } from 'src/app/shared/title';
import { RoleModel } from 'src/app/shared/role';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;
  hireDatePicker!: MatDatepickerToggle<any>;
  datePicker!: MatDatepickerToggle<any>;
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  titles: TitleModel[] = [];
  userRoles: RoleModel[] = []; // Initialize with your user role options
  selectedProfilePicture: { file: File, dataURL: string } | null = null;
  helpType: number = 0;
  public isValidEmail!: boolean;


  dateValidator: AsyncValidatorFn = (control: AbstractControl<any>): Promise<ValidationErrors | null> => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    if (selectedDate > currentDate) {
      return Promise.resolve({ futureDate: true });
    }
  
    return Promise.resolve(null);
  };
  

  constructor(private router: Router, 
    private apiService: APIService, 
    private fb: FormBuilder, 
    private toastr: NgToastService) {  
  }
  

  ngOnInit(): void {
    this.registerFormGroup = this.fb.group({
      TitleId: [null, Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      EmailAddress: ['', Validators.required],
      UserRoleId: [null, Validators.required],
      Password: ['', Validators.required],
      IsActive: [false, Validators.required],
    });
    this.apiService.getTitles().subscribe((titles: TitleModel[]) => {
      this.titles = titles;
      console.log(this.titles); // Check if titles are populated
    });
  
    this.apiService.getUserRoles().subscribe((userRoles: RoleModel[]) => {
      this.userRoles = userRoles;
      console.log(this.userRoles); // Check if user roles are populated
    });
  }
  hideShowPassword()
  {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  
  onSubmit(): void {
    if (this.registerFormGroup.valid && this.selectedProfilePicture) {
      // Prepare the form data
      const formData = new FormData();
      formData.append('TitleId', this.registerFormGroup.get('TitleId')!.value);
      formData.append('UserRoleId', this.registerFormGroup.get('UserRoleId')!.value);
      formData.append('FirstName', this.registerFormGroup.get('FirstName')!.value);
      formData.append('LastName', this.registerFormGroup.get('LastName')!.value);
      formData.append('EmailAddress', this.registerFormGroup.get('EmailAddress')!.value);
      formData.append('Password', this.registerFormGroup.get('Password')!.value);
      formData.append('IsActive', this.registerFormGroup.get('IsActive')!.value);
      formData.append('ProfilePicture', this.selectedProfilePicture.file);

      // Submit the form data
      this.apiService.Register(formData)
        .subscribe({
          next: (res) => {
            this.toastr.success({ detail: 'SUCCESS', summary: res.message, duration: 5000 });
            this.registerFormGroup.reset();
            this.selectedProfilePicture = null; // Reset profile picture
            this.router.navigate(['users']);
          },
          error: (err) => {
            if (err?.error?.message) {
              // Display the error message from the API in Toastr
              this.toastr.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
            }
          }
        });
    } else {
      ValidateForm.validateAllFormFields(this.registerFormGroup);
      alert("Your form is invalid");
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProfilePicture = {
          file: file,
          dataURL: e.target.result
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedProfilePicture = null;
    }
  }
  
  checkValidEmail(event: string)
  {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  
  cancel()
  {
    this.router.navigate(['users']);
  }
}
