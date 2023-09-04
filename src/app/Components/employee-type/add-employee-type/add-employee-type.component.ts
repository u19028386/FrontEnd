import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Employeetype } from 'src/app/shared/employeetype';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-add-employee-type',
  templateUrl: './add-employee-type.component.html',
  styleUrls: ['./add-employee-type.component.css']
})
export class AddEmployeeTypeComponent implements OnInit {
  employeetypeForm = new FormGroup({
    employeeTypeName: new FormControl('', Validators.required),
    employeeTypeDescription: new FormControl('', Validators.required)
  });


  isSubmitted: boolean = false;
  existingEmployeeTypeNames: string[] = [];


  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}


  ngOnInit(): void {
    this.getExistingEmployeeTypeNames();
  }


  getExistingEmployeeTypeNames() {
    this.dataService.getEmployeeTypes().subscribe((employeeTypes: Employeetype[]) => {
      this.existingEmployeeTypeNames = employeeTypes
        .map((type) => type.employeeTypeName)
        .filter((name) => name !== null) as string[];
    });
  }


  cancel() {
    this.router.navigate(['/types']);
  }


  onSubmit() {
    this.isSubmitted = true;


    if (this.employeetypeForm.invalid) {
      return;
    }


    const employeeTypeName: string = this.employeetypeForm.get('employeeTypeName')?.value || '';
    const employeeTypeDescription: string = this.employeetypeForm.get('employeeTypeDescription')?.value || '';


    if (this.existingEmployeeTypeNames.includes(employeeTypeName)) {
      this.toast.error({ detail: 'Error Message', summary: 'Employee type name already exists. Please enter a unique name.', duration: 5000 });
      return;
    }


    const employeeType: Employeetype = {
      employeeTypeId: 0,
      employeeTypeName: employeeTypeName,
      employeeTypeDescription: employeeTypeDescription
     
    };


    this.dataService.addEmployeeType(employeeType).subscribe((result) => {
      this.toast.success({ detail: 'Success Message', summary: 'Employee type added succcessfully', duration: 5000 });
      this.router.navigate(['/types']);
    },
   
    error => {
      this.toast.error({ detail: 'Error Message', summary: 'Employee type could not be added.', duration: 5000 });
    }
    );
  }
}

