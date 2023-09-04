import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Employee } from 'src/app/shared/employee';
import { NgToastService } from 'ng-angular-popup';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @ViewChild(DeleteConfirmationModalComponent) deleteConfirmationModal!: DeleteConfirmationModalComponent;


  deleteMessage: string = 'Are you sure you want to delete the item?';
  employees: Employee[] = [];
  filtered: Employee[] = [];
  searchName: string = '';
  employeeId! : number;
  regions: String[] = []; // Add an array to store regions
  selectedRegion: string = ''; // Selected region for filtering
  resources: String[] = [];
  selectedResource: string = '';
  itemToDelete: string = '';


  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}


  ngOnInit(): void {
    this.getEmployees();
  }


  getEmployees() {
    this.dataService.getEmployees().subscribe((result: Employee[]) => {
      this.employees = result;
      this.filtered = result;
      this.regions = Array.from(new Set(result.map(employee => employee.pRegion)));
      this.resources = Array.from(new Set(result.map(employee => employee.pResource)));
    });
  }


  applyFilters() {
    this.filterByRegion(); // Apply region filter
    this.filterByResource(); // Apply resource filter
  }


  filterByResource() {
    if (this.selectedResource) {
      this.filtered = this.filtered.filter(employee => employee.pResource === this.selectedResource);
    }
    else {
      this.filtered = this.employees;
    }
  }


  filterByRegion() {
    if (this.selectedRegion) {
      this.filtered = this.employees.filter(employee => employee.pRegion === this.selectedRegion);
    } else {
      this.filtered = this.employees;
    }
  }
 
  clearFilter() {
    this.selectedRegion = '';
    this.filtered = this.employees;
  }
 
  openDeleteModal(employee: Employee) {
    this.itemToDelete = employee.pFirstName + ' '  + employee.pLastName ;
    this.deleteConfirmationModal.openModal(this.itemToDelete);
  }


  deleteConfirmed() {
    if (this.itemToDelete) {
      const employeeToDelete = this.employees.find((employee) => employee.pFirstName + ' '  + employee.pLastName === this.itemToDelete);
      if (employeeToDelete) {
        this.dataService.deleteEmployee(employeeToDelete.employeeId).subscribe(
          (result) => {
            this.toast.success({ detail: 'Success Message', summary: 'Employee deleted successfully', duration: 5000 });
          window.location.reload();
          },
          (error) => {
            this.toast.error({ detail: 'Error Message', summary: 'Failed to delete employee.', duration: 5000 });
          }
        );
      }
    }
  }


       
search(): void {
  if (!this.searchName) {
      this.toast.error({ detail: 'Error Message', summary: 'Please enter a search term.', duration: 5000 });
      return;
  }
       
  this.filtered = this.employees.filter((employee) =>
    employee.pFirstName.toLowerCase().includes(this.searchName.toLowerCase())
  );
     
}


}
