import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { RoleModel } from 'src/app/shared/role';
import { TitleModel } from 'src/app/shared/title';
import { User } from 'src/app/shared/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users:any = [];
  public titles: TitleModel[] = [];
  public roles: RoleModel[] = [];
  selectedUser: any = {};
  searchText: string = '';
  allUsers: User[] = [];

  constructor(private apiService: APIService, private router: Router, private toastr: NgToastService){}

  ngOnInit(): void {
    this.apiService.getAllUsers()
    .subscribe(res=>{
    this.users = res;
    console.log(this.users);
    });
    this.apiService.getTitles()
    .subscribe(res=>{
    this.titles = res;
    console.log(this.titles);
    });
    this.apiService.getUserRoles()
    .subscribe(res=>{
    this.roles = res;
    console.log(this.roles);
    });
}
  getTitleNameById(titleId: number): string {
    const title = this.titles.find(title => title.titleId === titleId);
    return title ? title.titleName : '';
  }
  
  getUserRoleNameById(userRoleId: number): string {
    const role = this.roles.find(role => role.userRoleId === userRoleId);
    return role ? role.userRoleName : '';
  }

  onSearch(): void {
    const searchText = this.searchText.toLowerCase().trim();
    this.users = this.allUsers.filter(role =>
      role.firstName?.toLowerCase().includes(searchText) ||
      role.lastName?.toLowerCase().includes(searchText)  ||
      role.emailAddress?.toLowerCase().includes(searchText) ||
      role.isActive
    );
  }
  updateUser(user: User): void {
    // Make sure user.userId is valid
    if (user && user.userId !== undefined) {
      // Store the help data in local storage
      localStorage.setItem('UserData', JSON.stringify(user));
  
      // Navigate to the edit page
      this.router.navigate(['/update-user', user.userId]); // <-- Check this line
    } else {
      console.error('Invalid user data:', user);
    }
  }
  deactivateUser(user: User): void {
    this.apiService.deactivateUser(user.userId).subscribe(
      response => {
        console.log('User account deactivated:', response);
        // Optionally, you might want to update the user's active status locally
        user.isActive = false;
        this.toastr.success ({
          detail: "SUCCESS",
          summary: "The user account has been deactivated!",
          duration: 30000,
        })

      },
      error => {
        console.log('Error deactivating user account:', error);
        // Handle error, show error message to the user, etc.
      }
    );
  }
  
  
}
