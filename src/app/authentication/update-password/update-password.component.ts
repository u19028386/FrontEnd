import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit{
  userId: number = 0;
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  user: any = {};

  constructor(private apiService: APIService, 
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NgToastService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params); // Log the entire params object
      this.userId = +params['id']; // Convert the id parameter to a number
      console.log('Parsed userId:', this.userId);
    });
  }
  updatePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    // Call the API to update the password
    this.apiService.updatePassword(this.userId, this.newPassword).subscribe(
      () => {
        this.successMessage = 'Password updated successfully.';
        this.toastr.success({
          detail: "SUCCESS!",
          summary: "Password successfully updated!",
          duration: 3000
        });
        this.router.navigate(['profile', this.userId]);
      },
      error => {
        this.errorMessage = 'An error occurred while updating the password.';
        console.error(error);
        this.toastr.error({
          detail: "ERROR!",
          summary: "Couldn't update your password. Please try again",
          duration: 3000
        });
      }
    );
  }

  cancel()
  {
    this.router.navigate(['profile', this.userId]);
  }
}
