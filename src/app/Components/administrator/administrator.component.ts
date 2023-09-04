import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  public users:any = [];
  public role!:string;
  public fullName : string = "";
  constructor(private apiService: APIService, private userStore: UserStoreService){}

  ngOnInit(): void {
    this.apiService.getAllUsers()
    .subscribe(res=>{
    this.users = res;
    });
    this.userStore.getFullName()
    .subscribe(val=>{
      const fullNameFromToken = this.apiService.getNameFromToken();
      //this.fullName = val || fullNameFromToken
    });

    this.userStore.getRole()
    .subscribe(val=>{
      const roleFromToken = this.apiService.getRoleFromToken();
      //this.role = val || roleFromToken;
    })
  }

  logOut()
  {
    this.apiService.logOut();
  }

}
