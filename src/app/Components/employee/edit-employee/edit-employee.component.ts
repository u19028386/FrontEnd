import { Component, OnInit, ViewChild } from '@angular/core';
import { EditConfirmationModalComponent } from '../../edit-confirmation-modal/edit-confirmation-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/employee';
import { Employee2 } from 'src/app/shared/Employee2';
import { User } from 'src/app/shared/user';
import { Employeetype } from 'src/app/shared/employeetype';
import { Employeestatus } from 'src/app/shared/employeestatus';
import { Region } from 'src/app/shared/region';
import { Division } from 'src/app/shared/division';
import { Managertype } from 'src/app/shared/managertype';
import { Resource } from 'src/app/shared/resource';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit{
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


  employeeForm = new FormGroup({
    resourceId: new FormControl<number | null>(null, Validators.required),
    employeeTypeId: new FormControl<number | null>(null, Validators.required),
    managerTypeId: new FormControl<number | null>(null, Validators.required),
    userId: new FormControl<number | null>(null, Validators.required),
    employeeStatusId : new FormControl<number | null>(null, Validators.required),
    regionId : new FormControl<number | null>(null, Validators.required),
    divisionId : new FormControl<number | null>(null, Validators.required)
  });


  employeeId! : number;
  existingEmployeeNames : string[] = [];
  employee1: Employee | null = null;
  eemployee: Employee2 | null = null;
  users: User[] = [];
  employeeTypes: Employeetype[] = [];
  employeeStatuses: Employeestatus[] = [];
  regions: Region[] = [];
  divisions: Division[] = [];
  managerTypes: Managertype[] = [];
  resources : Resource[] = [];
  originalEmployeeTypeId : number | null = null;
  originalUserId : number | null = null;
  originalEmployeeStatusId : number | null = null;
  originalRegionId : number | null = null;
  originalDivisionId : number | null = null;
  originalManagerTypeId : number | null = null;
  originalResourceId : number | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  displayModal: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.fetchUsers();
    this.fetchEmployeeTypes();
    this.fetchEmployeeStatuses();
    this.fetchRegions();
    this.fetchDivisions();
    this.fetchManagerTypes();
    this.fetchResources();


    this.dataService.getEmployee(+this.route.snapshot.params['id']).subscribe((result) => {
      this.eemployee = result as Employee2;
      if (this.eemployee) {
        this.originalUserId = this.eemployee.userId;
        this.originalEmployeeTypeId = this.eemployee.employeeTypeId;
        this.originalEmployeeStatusId = this.eemployee.employeeStatusId;
        this.originalDivisionId = this.eemployee.divisionId;
        this.originalRegionId = this.eemployee.regionId;
        this.originalManagerTypeId = this.eemployee.managerTypeId;
        this.originalResourceId = this.eemployee.resourceId;


        this.employeeForm.patchValue({
          userId : this.eemployee.userId,
          employeeTypeId : this.eemployee.employeeTypeId,
          employeeStatusId : this.eemployee.employeeStatusId,
          divisionId : this.eemployee.divisionId,
          regionId : this.eemployee.regionId,
          managerTypeId : this.eemployee.managerTypeId,
          resourceId : this.eemployee.resourceId
         
        });
      }
    });
  }


  cancel(): void {
    this.router.navigate(['/employees']);
  }


fetchResources() {
    this.dataService.getResources().subscribe((resources) => {
        this.resources = resources;
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  }


  fetchUsers() {
    this.dataService.getUsers().subscribe((users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


 fetchEmployeeTypes() {
    this.dataService.getEmployeeTypes().subscribe((types) => {
        this.employeeTypes = types;
      },
      (error) => {
        console.error('Error fetching employee types:', error);
      }
    );
  }


  fetchEmployeeStatuses(){
    this.dataService.getEmployeeStatuses().subscribe((statuses) => {
        this.employeeStatuses = statuses;
      },
      (error) => {
        console.error('Error fetching employee statuses:', error);
      }
    );
  }


  fetchRegions(){
    this.dataService.getRegions().subscribe((regions) => {
        this.regions = regions;
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }


 fetchDivisions(){
    this.dataService.getDivisions().subscribe((divisions) => {
        this.divisions = divisions;
      },
      (error) => {
        console.error('Error fetching divisions:', error);
      }
    );
  }


 fetchManagerTypes(){
    this.dataService.getManagerTypes().subscribe((managerTypes) => {
        this.managerTypes = managerTypes;
      },
      (error) => {
        console.error('Error fetching manager types:', error);
      }
    );
  }


  openEditModal(eemployee: Employee2) {
    this.itemToEdit = eemployee.userId.toString() ;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.eemployee) {
      return;
    }


    if (
      this.employeeForm.value.resourceId === this.originalResourceId &&
      this.employeeForm.value.employeeTypeId === this.originalEmployeeTypeId &&
      this.employeeForm.value.managerTypeId === this.originalManagerTypeId &&
      this.employeeForm.value.userId === this.originalUserId &&
      this.employeeForm.value.employeeStatusId === this.originalEmployeeStatusId &&
      this.employeeForm.value.regionId === this.originalRegionId &&
      this.employeeForm.value.divisionId === this.originalDivisionId


    ){
        this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the employee.', duration: 5000 });
        return;
      }




    if (this.employeeTypes.find(type => type.employeeTypeId === this.employeeForm.value.employeeTypeId)?.employeeTypeName === 'Manager' &&
      this.managerTypes.find(type => type.managerTypeId === this.employeeForm.value.managerTypeId)?.managerTypeName === 'None') {
    this.toast.error({ detail: 'Error Message', summary: 'Manager type cannot be None for the employee type Manager.', duration: 5000 });
    return;
    }
   
   
    if (
      this.employeeTypes.find(type => type.employeeTypeId ===this.employeeForm.value.employeeTypeId)?.employeeTypeName !== 'Manager' &&
      this.managerTypes.find(type => type.managerTypeId === this.employeeForm.value.managerTypeId)?.managerTypeName !== 'None'
    ) {
      this.toast.error({
        detail: 'Error Message', summary: 'Manager type cannot be selected for non-manager employee type.', duration: 5000
      });
      return;
    }


    const updateEmployee: Employee2 = {
      employeeId: this.eemployee.employeeId,
      resourceId: this.employeeForm.value.resourceId as number,
      employeeTypeId: this.employeeForm.value.employeeTypeId as number,
      managerTypeId: this.employeeForm.value.managerTypeId as number,
      userId: this.employeeForm.value.userId as number,
      employeeStatusId: this.employeeForm.value.employeeStatusId as number,
      regionId : this.employeeForm.value.regionId as number,
      divisionId : this.employeeForm.value.divisionId as number
    };


    this.dataService.editEmployee(this.eemployee.employeeId, updateEmployee).subscribe(
      (response) => {
        this.toast.success({ detail: 'Success Message', summary: 'Employee updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/employees']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Error updating employee', duration: 5000 });
   
      }
    );
  }


}

