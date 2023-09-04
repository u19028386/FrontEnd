import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RoleModel } from 'src/app/shared/role';
import { APIService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit{
    RoleForm = new FormGroup({
    userRoleName: new FormControl(''),
    userRoleDescription: new FormControl('')
  });

  role: RoleModel | undefined;
  userRoleId: number | undefined;

  constructor(
    private apiService: APIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRoleId = parseInt(localStorage.getItem('userRoleId')!, 10);
    if (isNaN(this.userRoleId)) {


    } else {
      this.loadUserRole();
    }
  }
  loadUserRole(): void {
    this.apiService.GetRole(this.userRoleId!).subscribe(result => {
      this.role = result;
      this.populateForm();
    });
  }

  populateForm(): void {
    if (this.role) {
      this.RoleForm.patchValue({
        userRoleName: this.role.userRoleName || '',
        userRoleDescription: this.role.userRoleDescription || ''
      });
    }
  }

  cancel(): void {
    localStorage.removeItem('userRoleId');
    this.router.navigate(['/roles']);
  }

  onSubmit(): void {
    if (this.role && this.userRoleId) {
      const updatedRole: RoleModel = {
        userRoleId: this.userRoleId,
        userRoleName: this.RoleForm.value.userRoleName || '',
        userRoleDescription: this.RoleForm.value.userRoleDescription || ''
      };


      this.apiService.EditUserRole(updatedRole.userRoleId, updatedRole).subscribe(result => {
        localStorage.removeItem('userRoleId');
        this.router.navigate(['/roles']);
      });
    }
  }

}
