import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Employee } from 'src/app/shared/employee';
import { Eemployee } from 'src/app//shared/eemployee';
import { User } from 'src/app/shared/user';
import { Employeetype } from 'src/app//shared/employeetype';
import { Employeestatus } from 'src/app//shared/employeestatus';
import { Region } from 'src/app/shared/region';
import { Division } from 'src/app/shared/division';
import { Managertype } from 'src/app/shared/managertype';
import { Resource } from 'src/app/shared/resource';
import { NgToastService } from 'ng-angular-popup';
import { Employee2 } from 'src/app/shared/Employee2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm = new FormGroup({
    userId: new FormControl('', Validators.required),
    resourceId: new FormControl('', Validators.required),
    employeeTypeId: new FormControl('', Validators.required),
    employeeStatusId: new FormControl('', Validators.required),
    regionId: new FormControl('', Validators.required),
    divisionId: new FormControl('', Validators.required),
    managerTypeId: new FormControl('', Validators.required)
  });


  existingUserIds: Number[] = [];
  existingEmployeeUserIds: Number[] = [];
  existingUserNames: string[] = [];


  employees : Employee[] = [];
  users: User[] = [];
  employeeTypes: Employeetype[] = [];
  employeeStatuses: Employeestatus[] = [];
  regions: Region[] = [];
  divisions: Division[] = [];
  managerTypes: Managertype[] = [];
  resources : Resource[] = [];
  isSubmitted: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getUsers();
    this.getEmployeeTypes();
    this.getEmployeeStatuses();
    this.getRegions();
    this.getDivisions();
    this.getManagerTypes();
    this.getResources();
    this.getEmployees();
    this.getExistingEmployeeUserIds();
    this.updateManager();
  }


  getUsers() {
    this.dataService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.existingUserIds = users.map(user => user.userId);
      this.existingUserNames = users.map(user => `${user.firstName} ${user.lastName}`);
      console.log(this.existingUserIds);
    });
  }


getExistingEmployeeUserIds() {
    this.dataService.getEmployees().subscribe((employees: Employee[]) => {
      this.existingEmployeeUserIds = employees
      .map((employee) => employee.userId)
      .filter((Id) => Id !== null) as number[];
  });
  }


getEmployees() {
  this.dataService.getEmployees().subscribe((eemployees: Employee2[]) => {
    this.employees = this.employees;
  });


  this.existingEmployeeUserIds = this.employees.map(employee => employee.userId);
}


getResources() {
  this.dataService.getResources().subscribe((resources: Resource[]) => {
    this.resources = resources;
  });
}


getRegions() {
  this.dataService.getRegions().subscribe((regions: Region[]) => {
    this.regions = regions;
  });
}


getDivisions() {
  this.dataService.getDivisions().subscribe((divisions: Division[]) => {
    this.divisions = divisions;
  });
}


getManagerTypes() {
  this.dataService.getManagerTypes().subscribe((managerTypes: Managertype[]) => {
    this.managerTypes = managerTypes;
  });
}


getEmployeeStatuses() {
  this.dataService.getEmployeeStatuses().subscribe((employeeStatuses: Employeestatus[]) => {
    this.employeeStatuses = employeeStatuses;
  });
}


getEmployeeTypes() {
  this.dataService.getEmployeeTypes().subscribe((employeeTypes: Employeetype[]) => {
    this.employeeTypes = employeeTypes;
  });
}


cancel() {
  this.router.navigate(['/employees']);
}


updateManager() {
  const employeeTypeId = this.employeeForm.get('employeeTypeId')?.value;


  if (employeeTypeId === 'Consultant') {
    const noneManager = this.managerTypes.find(managerType => managerType.managerTypeName === 'None');
   
    if (noneManager) {
      this.employeeForm.get('managerTypeId')?.setValue(noneManager.managerTypeId.toString());
    }
    this.employeeForm.get('managerTypeId')?.disable();
  } else {
    this.employeeForm.get('managerTypeId')?.enable();
  }
}


onSubmit() {
  this.isSubmitted = true;


  if (this.employeeForm.invalid) {
    return;
  }


  const userId: number = parseInt(this.employeeForm.get('userId')?.value ?? '0', 10);
  const employeeId: number = parseInt(this.employeeForm.get('employeeId')?.value ?? '0', 10);
  const resourceId: number = parseInt(this.employeeForm.get('resourceId')?.value ?? '0', 10);
  const regionId: number = parseInt(this.employeeForm.get('regionId')?.value ?? '0', 10);
  const divisionId: number = parseInt(this.employeeForm.get('divisionId')?.value ?? '0', 10);
  const managerTypeId: number = parseInt(this.employeeForm.get('managerTypeId')?.value ?? '0', 10);
  const employeeStatusId: number = parseInt(this.employeeForm.get('employeeStatusId')?.value ?? '0', 10);
  const employeeTypeId: number = parseInt(this.employeeForm.get('employeeTypeId')?.value ?? '0', 10);


  if (this.existingEmployeeUserIds.includes(userId)) {
    this.toast.error({ detail: 'Error Message', summary: 'User already exists as an employee. Please pick a another user.', duration: 5000 });


    return;
  }


  if (this.employeeTypes.find(type => type.employeeTypeId === employeeTypeId)?.employeeTypeName === 'Manager' &&
  this.managerTypes.find(type => type.managerTypeId === managerTypeId)?.managerTypeName === 'None') {
this.toast.error({ detail: 'Error Message', summary: 'Manager type cannot be None for the employee type Manager.', duration: 5000 });
return;
}




if (
  this.employeeTypes.find(type => type.employeeTypeId === employeeTypeId)?.employeeTypeName !== 'Manager' &&
  this.managerTypes.find(type => type.managerTypeId === managerTypeId)?.managerTypeName !== 'None'
) {
  this.toast.error({
    detail: 'Error Message',
    summary: 'Manager type cannot be selected for non-manager employee type.',
    duration: 5000
  });
  return;
}


  const employee: Employee2 = {
    employeeId: 0,
    userId: userId,
    resourceId: resourceId,
    regionId : regionId,
    divisionId : divisionId,
    managerTypeId : managerTypeId,
    employeeStatusId : employeeStatusId,
    employeeTypeId : employeeTypeId
   
  };
 
  this.dataService.addEmployee(employee).subscribe((result) => {
          this.toast.success({ detail: 'Success Message', summary: 'Employee added successfully.', duration: 5000 });
          this.router.navigate(['/employees']);
        },
        (error) => {
          this.toast.error({ detail: 'Error Message', summary: 'Employee could not be added.', duration: 5000 });
        }
      );
}


}





