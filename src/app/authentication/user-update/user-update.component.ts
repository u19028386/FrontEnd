import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { RoleModel } from 'src/app/shared/role';
import { TitleModel } from 'src/app/shared/title';
import { User } from 'src/app/shared/user';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  // Define properties for user details
  userId!: number;
  user: User | null = null;
  userRoles: RoleModel[] = [];
  titles: TitleModel[] = [];


  // Add properties for form fields
  firstName: string = '';
  lastName: string = '';
  emailAddress: string = '';
  userRole: number = 0;
  title: number = 0;
  profilePicture: File | null = null;


  constructor(private apiService: APIService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NgToastService) { }
  

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const id = +params['id'];
      
        if (!isNaN(id)) {
          this.userId = id;
          this.loadUser();
        } else {
          console.error('Invalid user ID:', params['id']);
          // Handle the case where id is not a valid number
          // For example, you might want to display an error message
        }
      });
      this.loadTitles();
      this.loadRoles();
    }

    loadUser(): void {
      // Fetch the help details from the server using the help ID
      this.apiService.getUser(this.userId).subscribe(
        (user: User) => {
          this.user = user;
          // Pre-fill the form fields with the existing data
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.emailAddress = user.emailAddress;
          this.userRole = user.userRoleId;
          this.title = user.titleId;
        },
        error => {
          console.log('Error loading the user:', error);
        }
      );
    }

    loadRoles(): void {
      this.apiService.getUserRoles().subscribe(
        (userRoles: RoleModel[]) => {
          this.userRoles = userRoles;
        },
        error => {
          console.log('Error loading roles:', error);
        }
      );
    }
    loadTitles(): void {
      this.apiService.getTitles().subscribe(
        (titles: TitleModel[]) => {
          this.titles = titles;
        },
        error => {
          console.log('Error loading titles:', error);
        }
      );
    }
    onFileChange(event: any): void {
      this.profilePicture = event.target.files.item(0);
    }

    onSubmit(): void {
      // Add validation here to ensure required fields are filled
      if (!this.firstName || !this.lastName || !this.emailAddress || !this.userRole || !this.title || !this.profilePicture) {
        this.toastr.error ({
          detail: "ERROR",
          summary: "Please make sure all fields are entered!",
          duration: 30000,
        })
        return;
      }
  
  
      const formData = new FormData();
      formData.append('FirstName', this.firstName);
      formData.append('LastName', this.lastName);
      formData.append('EmailAddress', this.emailAddress);
      formData.append('UserRoleId', this.userRole.toString());
      formData.append('TitleId', this.title.toString());
      formData.append('ProfilePicture', this.profilePicture);
  
      if (this.user) {
        this.apiService.updateUser(this.user.userId, formData).subscribe(
          (updatedUser: User) => {
            console.log('The user has been updated successfully:', updatedUser);
            this.toastr.success ({
              detail: "SUCCESS",
              summary: "The user has been successfully updated!",
              duration: 30000,
            })
            this.router.navigate(['/users']);
          },
          error => {
            console.log('Error updating user:', error);
            this.toastr.error ({
              detail: "ERROR",
              summary: "There was an error updating the user. Please try again",
              duration: 30000,
            })
          }
        );
      } else {
        console.error('User object is null');
      }
    }
  
  
    cancel(): void {
      this.router.navigate(['/users']);
    }
}
