import { Component, OnInit } from '@angular/core';
import { RoleModel } from 'src/app/shared/role';
import { APIService } from 'src/app/services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit{
  roles: RoleModel[] = [];
  allRoles: RoleModel[] = [];
  searchText: string = '';

  constructor(private apiService: APIService, private router: Router, private toastr: NgToastService) { }


  ngOnInit(): void {
    this.getUserRoles();
  }

  getUserRoles(): void {
    this.apiService.getUserRoles().subscribe(result => {
      this.roles = result;
      this.allRoles = result; // Keep a copy of all help types for filtering
    });
  }
  deleteUserRole(userRoleId: number): void {
    this.apiService.DeleteUserRole(userRoleId).subscribe(() => {
      window.location.reload();
    });
  }

  editUserRole(userRoleId: number): void {
    localStorage.setItem('userRoleId', userRoleId.toString());
    this.router.navigate(['edit-role']);
  }

  onSearch(): void {
    // Filter the helpTypes based on the search text
    const searchText = this.searchText.toLowerCase().trim();
    this.roles = this.allRoles.filter(role =>
      role.userRoleName?.toLowerCase().includes(searchText) ||
      role.userRoleDescription?.toLowerCase().includes(searchText)
    );
  }
}
