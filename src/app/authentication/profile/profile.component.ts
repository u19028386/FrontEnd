import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { RoleModel } from 'src/app/shared/role';
import { TitleModel } from 'src/app/shared/title';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {}; // This will hold the user details
  profilePictureUrl: string = ''; // This will hold the URL for the profile picture
  public titles: TitleModel[] = [];
  public roles: RoleModel[] = [];
  public userId!: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: APIService,
    private userStore: UserStoreService,
    private router:Router
  ) { }

  ngOnInit(): void {

    
    const userId = +this.route.snapshot.params['userId'];
    // Get the userId from the route parameters
    this.route.params.subscribe(params => {
      const userId = +params['userId'];
      
      if (!isNaN(userId)) {
        // Fetch user details based on userId
        this.apiService.getUserDetails(userId).subscribe(
          (userDetails: any) => {
            this.user = userDetails;
            // Construct the profile picture URL
            //this.profilePictureUrl = this.apiService.getProfilePictureUrl(userDetails.fileName);
          },
          error => {
            console.log('Error fetching user details:', error);
          }
        );
      }
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
    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
    });

    this.apiService.getProfilePictureUrl(+this.userId).subscribe(
      (response: any) => {
        // `response` will contain the profile picture data
        this.profilePictureUrl = URL.createObjectURL(response);
      },
      (error) => {
        console.log('Error fetching profile picture:', error);
      }
    );
  }

  getTitleNameById(titleId: number): string {
    const title = this.titles.find(title => title.titleId === titleId);
    return title ? title.titleName : '';
  }
  
  getUserRoleNameById(userRoleId: number): string {
    const role = this.roles.find(role => role.userRoleId === userRoleId);
    return role ? role.userRoleName : '';
  }
  goToUpdatePassword(): void {
    this.router.navigate(['update-password', this.userId]);
  }



}
