import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Employeetype } from 'src/app/shared/employeetype';
import { NgToastService } from 'ng-angular-popup';
import { EditConfirmationModalComponent } from '../../edit-confirmation-modal/edit-confirmation-modal.component';


@Component({
  selector: 'app-edit-employee-type',
  templateUrl: './edit-employee-type.component.html',
  styleUrls: ['./edit-employee-type.component.css']
})
export class EditEmployeeTypeComponent implements OnInit {
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


  employeetypeForm = new FormGroup({
    employeeTypeName: new FormControl('', Validators.required),
    employeeTypeDescription: new FormControl('', Validators.required)
  });


  employeetype: Employeetype | null = null;
  existingEmployeeTypeNames: string[] = [];
  originalEmployeeTypeName: string | null = null;
  originalEmployeeTypeDescription: string | null = null;
  changesMade = false;
  existingAccounts: string[] = [];
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  employeetypes: Employeetype[] = [];
  displayModal: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getExistingEmployeeTypeNames();
    this. getExistingBoth();


    this.dataService.getEmployeetype(+this.route.snapshot.params['id']).subscribe((result) => {
        this.employeetype = result as Employeetype;
        if (this.employeetype) {


          this.originalEmployeeTypeName = this.employeetype.employeeTypeName;
        this.originalEmployeeTypeDescription = this.employeetype.employeeTypeDescription;


          this.employeetypeForm.patchValue({
            employeeTypeName: this.employeetype.employeeTypeName || '',
            employeeTypeDescription: this.employeetype.employeeTypeDescription || ''
          });
        }
      });
  }


  getExistingEmployeeTypeNames() {
    this.dataService.getEmployeeTypes().subscribe((employeeTypes: Employeetype[]) => {
      this.existingEmployeeTypeNames = employeeTypes
        .map((type) => type.employeeTypeName)
        .filter((name) => !!name);
    });
  }


  getExistingBoth() {
    this.dataService.getEmployeeTypes().subscribe((employeeTypes: Employeetype[]) => {
      this.existingEmployeeTypeNames = employeeTypes
        .map((type) => type.employeeTypeName)
        .filter((name) => !!name);
    });


    const id = +this.route.snapshot.params['id'];
    this.dataService.getEmployeetype(id).subscribe((result) => {
      this.employeetype = result as Employeetype;
      if (this.employeetype) {
        this.originalEmployeeTypeName = this.employeetype.employeeTypeName;
        this.originalEmployeeTypeDescription = this.employeetype.employeeTypeDescription;
        this.employeetypeForm.patchValue({
          employeeTypeName: this.employeetype.employeeTypeName || '',
          employeeTypeDescription: this.employeetype.employeeTypeDescription || ''
        });
      }
    });
  }


 
  cancel() {
    this.router.navigate(['/types']);
  }


  openEditModal(employeetype: Employeetype) {
    this.itemToEdit = employeetype.employeeTypeName;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.employeetype) {
      return;
    }
 
    if (
      this.employeetypeForm.value.employeeTypeName === this.originalEmployeeTypeName&&
      this.employeetypeForm.value.employeeTypeDescription === this.originalEmployeeTypeDescription
    ) {
      this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the employee type.', duration: 5000 });
      return;
    }
 
    const updatedEmployeeType: Employeetype = {
      employeeTypeId: this.employeetype.employeeTypeId,
      employeeTypeName : this.employeetypeForm.value.employeeTypeName || '',
      employeeTypeDescription : this.employeetypeForm.value.employeeTypeDescription  || ''
    };
 
    this.dataService.editEmployeeType(this.employeetype.employeeTypeId, updatedEmployeeType).subscribe(
      (result) => {
        this.toast.success({ detail: 'Success Message', summary: 'Employee type updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/types']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Failed to update employee type.', duration: 5000 });
      }
    );
  }
}

