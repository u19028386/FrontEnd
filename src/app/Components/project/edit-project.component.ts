import { NgToastService } from 'ng-angular-popup';
import { Client } from 'src/app/shared/client';
import { Project } from 'src/app/shared/project';
import { Projectstatus } from 'src/app/shared/projectstatus';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditConfirmationModalComponent } from '../edit-confirmation-modal/edit-confirmation-modal.component';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


  projectForm = new FormGroup({
    projectName: new FormControl('', Validators.required),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null, Validators.required),
    clientId: new FormControl<number | null>(null, Validators.required),
    projectStatusId: new FormControl<number | null>(null, Validators.required)
  });
 
  projectId!: number;
  existingProjectNames: string[] = [];
  projectstatuses: Projectstatus[] = [];
  clients: Client[] = [];
  project: Project | null = null;
  originalProjectName: string | null = null;
  originalEndDate: Date | null = null;
  originalStartDate: Date | null = null;
  originalClientId : number | null = null;
  originalProjectStatusId : number | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  projects : Project[] = [];
  displayModal: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {}




  ngOnInit(): void {
    this.getClients();
    this.getProjectStatuses();


    this.dataService.getProject(+this.route.snapshot.params['id']).subscribe((result) => {
      this.project = result as Project;
      if (this.project) {
        this.originalProjectName = this.project.projectName;
        this.originalClientId = this.project.clientId;
        this.originalProjectStatusId = this.project.projectStatusId;
        this.originalEndDate = this.project.endDate;
        this.originalStartDate = this.project.startDate;


        this.projectForm.patchValue({
          projectName : this.project.projectName || '',
          clientId : this.project.clientId,
          projectStatusId : this.project.projectStatusId,
          startDate: this.project.startDate || new Date(),
          endDate: this.project.endDate || new Date()
        });
      }
    });
  }


  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  getExistingProjectNames() {
    this.dataService.getProjects().subscribe((projects: Project[]) => {
      this.existingProjectNames = projects.map(
        (project) => project.projectName
      );
    });
  }


  getClients() {
    this.dataService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    });
  }


  getProjectStatuses() {
    this.dataService.getProjectStatuses().subscribe((projectstatuses: Projectstatus[]) => {
      this.projectstatuses = projectstatuses;
    });
  }




  cancel() {
    this.router.navigate(['/project']);
  }


  openEditModal(project: Project) {
    this.itemToEdit = project.projectName;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.project) {
      return;
    }


    const startDateString = this.projectForm.value.startDate;
    const startDate = startDateString ? new Date(startDateString) : new Date();
    const endDateString = this.projectForm.value.endDate;
    const endDate = endDateString ? new Date(endDateString) : new Date();


    const projectName: string = this.projectForm.get('projectName')?.value || '';


 
      if (endDate < startDate) {
      this.toast.error({ detail: 'Error Message', summary: 'End Date must be greater than or equal to Start Date.', duration: 5000 });
      return;
    }




    if (
      this.projectForm.value.projectName === this.originalProjectName &&
      this.projectForm.value.clientId === this.originalClientId &&
      this.projectForm.value.projectStatusId === this.originalProjectStatusId &&
      this.projectForm.value.endDate === this.originalEndDate &&
      this.projectForm.value.startDate === this.originalStartDate
    ){
        this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the project.', duration: 5000 });
        return;
      }




 
    const updatedProject: Project = {
      projectId : this.project.projectId,
      projectName : this.projectForm.value.projectName || '',
      clientId : this.projectForm.value.clientId as number,
      projectStatusId : this.projectForm.value.projectStatusId as number,
      startDate : this.projectForm.value.startDate ?? new Date(),
      endDate : this.projectForm.value.endDate ?? new Date()
    };
   
 
    this.dataService.editProject(this.project.projectId, updatedProject).subscribe(
      (result) => {
        this.toast.success({ detail: 'Success Message', summary: 'Project updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/project']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Failed to update project.', duration: 5000 });
      }
    );
  }




}





