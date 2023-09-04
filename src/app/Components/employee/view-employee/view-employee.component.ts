import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Eemployee } from 'src/app/shared/eemployee';
import { DatePipe } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewemployeeComponent implements OnInit{


  employeeId! : number;
  employee! : Eemployee;
  userId! : number;
  resourceId! : number;
  employeeStatusId! : number;
  regionId! : number ;
  divisionId! : number ;
  managerTypeId! : number;
  employeeTypeId! : number;
 
  users: any[] = [];
  resources: any[] = [];
  employeestatuses : any[] = [];
  regions : any[] = [];
  divisions : any[] = [];
  managertypes : any[] = [];
  employeetypes : any[] = [];
 
  constructor(private dataService: DataService, private router: Router, private route : ActivatedRoute,   private toast: NgToastService) {}


  ngOnInit(): void {
   
    this.dataService.getEmployees().subscribe(
      (data: any[]) => {
     
        this.users = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();


        });
      },
      (error) => {
      this.toast.error({ detail: 'Error Message', summary: 'Employee details not found', duration: 5000 });
      }
    );


    this.dataService.getUsers().subscribe(
      (data: any[]) => {
     
        this.users = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getResources().subscribe(
      (data: any[]) => {
     
        this.resources = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getDivisions().subscribe(
      (data: any[]) => {
     
        this.divisions = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getManagerTypes().subscribe(
      (data: any[]) => {
     
        this.managertypes = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getRegions().subscribe(
      (data: any[]) => {
     
        this.regions = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getEmployeeStatuses().subscribe(
      (data: any[]) => {
     
        this.employeestatuses = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


    this.dataService.getEmployeeTypes().subscribe(
      (data: any[]) => {
     
        this.employeetypes = data;
        this.route.params.subscribe(params => {
          this.employeeId = params['employeeId'];
          this.loadEmployee();
        });
      },
      (error) => {
        console.log(error);
      }
    );


 
  }


  loadEmployee(): void {
    this.dataService.getEmployee(this.employeeId).subscribe(
      (data: Eemployee) => {
        this.employee = data;
        this.userId = this.employee.userId;
        this.resourceId = this.employee.resourceId;
        this.divisionId = this.employee.divisionId;
        this.regionId = this.employee.regionId;
        this.employeeStatusId = this.employee.employeeStatusId;
        this.employeeTypeId = this.employee.employeeTypeId;
 
      },
      (error) => {
        console.log(error);
      }
    );
  }


  back() {
    this.router.navigate(['/employees']);
  }




  getSelectedUserActive(): Boolean {
    const selected = this.users.find(user =>  user.userId === this.userId);
    return selected ? selected.isActive : '';
  }




  getSelectedEmployeeStatus(): string {
    const selected = this.employeestatuses.find(employeestatus =>  employeestatus.employeeStatusId === this.employeeStatusId);
    return selected ? selected.employeeStatusName : '';
  }


  getSelectedEmployeeType(): string {
    const selected = this.employeetypes.find(employeetype =>  employeetype.employeeTypeId === this.employeeTypeId);
    return selected ? selected.employeeTypeName: '';
  }


  getSelectedRegion(): string {
    const selected = this.regions.find(region =>  region.regionId === this.regionId);
    return selected ? selected.regionName : '';
  }


  getSelectedDivision(): string {
    const selected = this.divisions.find(division =>  division.divisionId === this.divisionId);
    return selected ? selected.divisionName : '';
  }


  getSelectedResource(): string {
    const selected = this.resources.find(resource =>  resource.resourceId === this.resourceId);
    return selected ? selected.resourceName : '';
  }


 
  getSelectedUserFirstName(): string {
    const selectedUser = this.users.find(user => user.userId === this.userId);
    return selectedUser ? selectedUser.firstName : '';
  }


  getSelectedUserLastName(): string {
    const selectedUser = this.users.find(user => user.userId === this.userId);
    return selectedUser ? selectedUser.lastName : '';
  }


  getSelectedUserEmail(): string {
    const selectedUser = this.users.find(user => user.userId === this.userId);
    return selectedUser ? selectedUser.emailAddress : '';
  }


  getSelectedManagerType(): string {
    const selectedUser = this.managertypes.find(managertype => managertype.managerTypeId === this.managerTypeId);
    return selectedUser ? selectedUser.managerTypeName : '';
  }


}
