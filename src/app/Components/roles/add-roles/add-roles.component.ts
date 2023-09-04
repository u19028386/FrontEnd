import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { RoleModel } from 'src/app/shared/role';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.css']
})
export class AddRolesComponent implements OnInit{

  RoleForm: FormGroup;
  
  constructor( private router: Router,private apiService: APIService, private formBuilder: FormBuilder, private toastr: NgToastService){
    this.RoleForm = this.formBuilder.group({
      userRoleName: ['', Validators.required],
      userRoleDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  cancel(){
    this.router.navigate(['/roles'])
  }
  onSubmit() {
    if(this.RoleForm.valid)
    {
      const userRoleName: string = this.RoleForm.get('userRoleName')?.value || '';
    const userRoleDescription: string = this.RoleForm.get('userRoleDescription')?.value || '';
 
    const role: RoleModel = {
      userRoleId: 0, // Assuming you set the appropriate value on the server-side
      userRoleName: userRoleName,
      userRoleDescription: userRoleDescription
    };
 
    this.apiService.AddUserRole(role).subscribe(result => {
      this.router.navigate(['/roles']);
    });

    }
    else{
      ValidateForm.validateAllFormFields(this.RoleForm);
      this.toastr.error({ detail: "ERROR", summary: "Please make sure all fields are entered!", duration: 5000 });
    } 
  }
}
