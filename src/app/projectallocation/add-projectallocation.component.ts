import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Project } from '../shared/project';  
import { NgToastService } from 'ng-angular-popup';
import { ProjectAllocation } from '../shared/projectAllocation';
import { ClaimItem } from '../shared/claimItem';
import { User } from '../shared/user';

import { Employee2 } from '../shared/Employee2';
import { Employee } from '../shared/employee';
import { Projectview } from '../shared/projectview';
import { MaxHour } from '../shared/maxHours';


@Component({
  selector: 'app-add-projectAllocation',  
  templateUrl: './add-projectAllocation.component.html',
  styleUrls: ['./add-projectAllocation.component.css']
})
export class AddProjectAllocationComponent implements OnInit {
  projectAForm = new FormGroup({  
    projectId: new FormControl('', Validators.required),  
    isEligibleToClaim: new FormControl(''),
    employeeId: new FormControl('', Validators.required),
    claimableAmount: new FormControl(0, Validators.required),
    totalNumHours: new FormControl(0, Validators.required),
    billableOverTime :new FormControl(0, Validators.required),
    isOperationalManager : new FormControl(''),
    isProjectManager : new FormControl(''),
    claimItemId : new FormControl('', Validators.required)


  });


claimitems : ClaimItem [] = [];
projects : Projectview [] = [];
users : User [] = [];
employees : Employee [] = [];
projectAllocations : ProjectAllocation [] = [];
existingProjectNames: number[] = [];
employeeStatus!: string;
projectStatus!: string;
existingNames: String[] = [];
existingSNames: String[] = [];
projectId! : number;
employeeId! : number;
isSubmitted: boolean = false;
existingEmployeeIds: Number[] = [];
existingProjectIds: Number[] = [];
noneClaimItemId: number | undefined;
maxs : MaxHour [] = [];


  constructor(
      private dataService: DataService,
      private router: Router,
      private toast: NgToastService
    ) {}


  ngOnInit(): void {
      this.getClaimItems();
      this.getProjects();
      this.getEmployees();
      this.getUsers();
      this.getProjectAllopcations();
      this.updateClaimableAmount();
      this.getMaxs();
    }


    getMaxs() {
      this.dataService.getMaximums().subscribe((maxs: MaxHour[]) => {
        this.maxs = maxs;
        console.log(maxs);
      });
    }


    getProjectAllopcations() {
      this.dataService.getProjectAllocations().subscribe((projectAllocations: ProjectAllocation[]) => {
        this.projectAllocations = projectAllocations;
      });
    }


    filterProjectsByStatus(projects: Projectview[]): Projectview[] {
      console.log(projects.filter(project => project.pStatus !== 'Completed'))
      return projects.filter(project => project.pStatus !== 'Completed');
    }
   
    filterEmployeesByStatus(employees: Employee[]): Employee[] {
      return employees.filter(employee => employee.pStatus === 'Available');
    }


    getProjects() {
      this.dataService.getProjects().subscribe((projects: Projectview[]) => {
        this.projects = this.filterProjectsByStatus(projects);
        console.log('Filtered Projects:', this.projects);
      });
    }
   
    getEmployees() {
      this.dataService.getEmployees().subscribe((employees: Employee[]) => {
        this.employees = this.filterEmployeesByStatus(employees);
      });
    }


    getClaimItems() {
      this.dataService.getClaimItems().subscribe((claimitems: ClaimItem[]) => {
        this.claimitems = claimitems;
      });
    }


    getUsers() {
      this.dataService.getUsers().subscribe((users: User[]) => {
        this.users = users;
      });
    }


   
cancel() {
  this.router.navigate(['/projectAllocation']);  
}


onSubmit() {
    this.isSubmitted = true;


  if (this.projectAForm.invalid) {
    return;
  }
    const projectId: number = parseInt(this.projectAForm.get('projectId')?.value ?? '0', 10);
    const employeeId: number = parseInt(this.projectAForm.get('employeeId')?.value ?? '0', 10);
    const claimableAmount: number = parseInt(this.projectAForm.get('claimableAmount')?.value?.toString() ?? '0', 10);
    const totalNumHours: number = parseInt(this.projectAForm.get('totalNumHours')?.value?.toString() ?? '0', 10);
    const billableOverTime: number = parseInt(this.projectAForm.get('billableOverTime')?.value?.toString() ?? '0', 10);
    const claimItemId: number = parseInt(this.projectAForm.get('claimItemId')?.value ?? '0', 10);
    const isEligibleToClaim: boolean = !!this.projectAForm.get('isEligibleToClaim')?.value;
    const isOperationalManager: boolean = !!this.projectAForm.get('isOperationalManager')?.value;
    const isProjectManager: boolean = !!this.projectAForm.get('isProjectManager')?.value;
   
    const isEmployeeAlreadyAllocated = this.projectAllocations.some((allocation: ProjectAllocation) => {
      return allocation.projectId === projectId && allocation.employeeId === employeeId;
  });


  if (isEmployeeAlreadyAllocated) {
      this.toast.error({
          detail: 'Error Message', summary: 'Employee already allocated to this project.',duration: 5000
      });
      return;
  }


  const projectHasOperationalManager = this.projectAllocations.some((allocation: ProjectAllocation) => {
    return allocation.projectId === projectId && allocation.isOperationalManager === true;
});


if (isOperationalManager && projectHasOperationalManager) {
    this.toast.error({
       detail: 'Error Message', summary: 'Operational Manager already exists for the project.', duration: 5000
    });
    return;
}
   


    const noneClaimItemId = this.claimitems.find(item => item.claimItemName === 'None')?.claimItemId;
       
    if (isEligibleToClaim && claimableAmount === 0) {
      this.toast.error({ detail: 'Error Message', summary: 'Claimable amount cannot be 0 for the selected claimable item.', duration: 5000 });
      return;
  }


  if (isEligibleToClaim && (claimItemId === noneClaimItemId)) {
    this.toast.error({ detail: 'Error Message', summary: 'Claimable item cannot be none if you eligible to claim is true.', duration: 5000 });
    return;
}


if (!isEligibleToClaim && (claimItemId === null || isNaN(claimItemId))) {
  this.toast.error({ detail: 'Error Message', summary: 'Please check and uncheck is eligible checkbox.', duration: 5000 });
  return;
}


if (totalNumHours < 1) {
        this.toast.error({ detail: 'Error Message', summary: 'Project hours cannot be 0.', duration: 5000 });
        return;
    }

    const projectHasProjectManager = this.projectAllocations.some((allocation: ProjectAllocation) => {
      return allocation.projectId === projectId && allocation.isProjectManager === true;
  });
 
  if (isProjectManager && projectHasProjectManager) {
      this.toast.error({
          detail: 'Error Message', summary: 'Project Manager already exists for the project.', duration: 5000
      });
      return;
  }


  const selectedEmployee = this.employees.find(employee => employee.employeeId === employeeId);


if (selectedEmployee && selectedEmployee.pType === 'Consultant' && isOperationalManager) {
  this.toast.error({
    detail: 'Error Message', summary: 'Consultants cannot be set as Operational Managers.', duration: 5000
  });
  return;
}


const maxHoursRecord = this.maxs[0];


if (!maxHoursRecord) {
  this.toast.error({
    detail: 'Error Message', summary: 'Max Hours record not found.', duration: 5000
  });
  return;
}


const maxHours: number = maxHoursRecord.maxHours;


if (totalNumHours > maxHours) {
  this.toast.error({
    detail: 'Error Message', summary: 'The total number hours allocated exceeds the maximum allowed hours.', duration: 5000
  });
  return;
}


    const projectAllocation: ProjectAllocation = {
        projectAllocationId: 0,
        employeeId: employeeId,
        projectId: projectId,
        claimableAmount: claimableAmount,
        totalNumHours: totalNumHours,
        billableOverTime: billableOverTime,
        claimItemId: claimItemId,
        isEligibleToClaim: isEligibleToClaim,
        isOperationalManager: isOperationalManager,
        isProjectManager: isProjectManager
    }


   
    this.dataService.addProjectAllocation(projectAllocation).subscribe((result) => {
            this.toast.success({
                detail: 'Success Message', summary: 'Project allocation added successfully', duration: 5000
            });
            this.router.navigate(['/projectAllocation']);
        }
       
    );
}
 
  updateClaimableAmount() {
    const isEligibleToClaim = this.projectAForm.get('isEligibleToClaim')?.value;

    if (!isEligibleToClaim) {
        const noneClaimItem = this.claimitems.find(item => item.claimItemName === 'None');
        if (noneClaimItem) {
            this.projectAForm.get('claimItemId')?.setValue(noneClaimItem.claimItemId.toString());
        }
        this.projectAForm.get('claimItemId')?.disable();
        this.projectAForm.get('claimableAmount')?.disable();
    }
    else {
        this.projectAForm.get('claimItemId')?.enable();
        this.projectAForm.get('claimableAmount')?.enable();
    }
}


updateOperationalManager() {
  const isOperationalManager = this.projectAForm.get('isOperationalManager');
  const isProjectManager = this.projectAForm.get('isProjectManager');

  if (isOperationalManager?.value) {
    isProjectManager?.disable();
  } else {
    isProjectManager?.enable();
  }
}

updateProjectManager() {
  const isOperationalManager = this.projectAForm.get('isOperationalManager');
  const isProjectManager = this.projectAForm.get('isProjectManager');

  if (isProjectManager?.value) {
    isOperationalManager?.disable();
  } else {
    isOperationalManager?.enable();
  }
} 

}

