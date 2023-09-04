import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgToastService } from 'ng-angular-popup';
import { ProjectAllocation } from '../shared/projectAllocation';
import { ProjectAllocationView } from '../shared/projectAllocationView';
import { User } from '../shared/user';
import { Employee } from '../shared/employee';
import { Projectview } from '../shared/projectview';
import { DeleteConfirmationModalComponent } from '../Components/delete-confirmation-modal/delete-confirmation-modal.component';


@Component({
  selector: 'app-projectAllocation',
  templateUrl: './projectAllocation.component.html',
  styleUrls: ['./projectAllocation.component.css']
})
export class ProjectAllocationComponent implements OnInit {
  @ViewChild(DeleteConfirmationModalComponent) deleteConfirmationModal!: DeleteConfirmationModalComponent;


  deleteMessage: string = 'Are you sure you want to delete the allocation?';
  projectAllocations: ProjectAllocationView[] = [];
  filteredProjectAllocations: ProjectAllocationView[] = [];
  projectId!: number;
  projectAllocationId!: number;
  pName! : string;
  searchName! : string;
  users: User[] = [];
  employeeId! : number;
  userId! : number;
  employees: Employee[] = [];
  projects: Projectview[] = [];
  filtered: Projectview[] = [];
  selectedProject: string = 'all';
  filteredRows: Projectview[] = [];
  itemToDelete: string = '';
 
  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private toast: NgToastService) {}


  ngOnInit(): void {
    this.getProjectAllocations();
    this.getProjects();
  }


  filterTable() {
    if (this.selectedProject === 'all') {
      this.filteredProjectAllocations = this.projectAllocations;
    } else {
      this.filteredProjectAllocations = this.projectAllocations.filter(
        allocation => allocation.pName === this.selectedProject
      );
    }
  }
 


  getProjects() {
    this.dataService.getProjects().subscribe((result: Projectview[]) => {
      this.projects = result;
      this.filtered = result;
    });
  }


  getProjectAllocations() {
    this.dataService.getProjectAllocations().subscribe((result: ProjectAllocationView[]) => {
      this.projectAllocations = result;
      this.filterProjectAllocations();
    });
  }


  filterProjectAllocations() {
    if (this.projectAllocationId) {
      this.filteredProjectAllocations = this.projectAllocations.filter(
        allocation => allocation.pName === this.pName
      );
    } else {
      this.filteredProjectAllocations = this.projectAllocations;
    }
  }


  openDeleteModal(projectAllocation: ProjectAllocationView) {
    this.itemToDelete = projectAllocation.firstName;
    this.deleteConfirmationModal.openModal(this.itemToDelete);
  }


  deleteConfirmed() {
    if (this.itemToDelete) {
      const projectAllocationToDelete = this.projectAllocations.find((projectAllocation) => projectAllocation.firstName === this.itemToDelete);
      if (projectAllocationToDelete) {
        this.dataService.deleteProjectAllocation(projectAllocationToDelete.projectAllocationId).subscribe(
          (result) => {
            this.toast.success({ detail: 'Success Message', summary: 'Project allocation deleted successfully', duration: 5000 });
          window.location.reload();
          },
          (error) => {
            this.toast.error({ detail: 'Error Message', summary: 'Failed to delete project allocation.', duration: 5000 });
          }
        );
      }
    }


    this.itemToDelete = '';
  }


      getUsers() {
        this.dataService.getEmployees().subscribe((result: Employee[]) => {
          this.employees = result;
          console.log(this.employees);
          this.filterProjectAllocations();
        });
      }
}


       
         
       
