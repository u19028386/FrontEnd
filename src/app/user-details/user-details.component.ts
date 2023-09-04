import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/api.service';

interface UserDetails {
  userId: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  preferredName: string;
  dateOfHire: Date;
  cellphoneNumber: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  userDetails: UserDetails | undefined;
  userEmail: string | undefined;

  constructor(private http: HttpClient, private apiService: APIService) { }

  ngOnInit() {
    // const userEmail = this.userDetails?.email;
    // this.apiService.getUserDetails().subscribe(
    //   // (userDetails: UserDetails) => {
    //   //   this.userDetails = userDetails;
    //   //   this.userEmail = userDetails.email;
    //   // },
    //   (error) => {
    //     console.error('Error occurred while retrieving user details:', error);
    //   }
    // );
//     console.log('this.userDetails:', this.userDetails);
//     console.log('userEmail:', userEmail);

//     if (userEmail) {
//       this.apiService.getUserEmail(userEmail).subscribe(
//         (email: string | undefined) => {
//           this.userEmail = email;
//         },
//         (error) => {
//           console.error('Error occurred while retrieving user email:', error);
//         }
//       );
//   } else {
//     console.error('User email is undefined');
//   }
 }
}

