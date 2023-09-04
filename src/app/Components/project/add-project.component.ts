import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Project } from 'src/app/shared/project';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';
import { Projectstatus } from 'src/app/shared/projectstatus';

@Component({
  selector: 'app-add-project',  
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {  
  projectForm = new FormGroup({  
    projectName: new FormControl('', Validators.required),  
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    clientId: new FormControl('', Validators.required),
    projectStatusId: new FormControl('', Validators.required)
  });


  existingProjectNames: string[] = [];
  projectstatuses: Projectstatus[] = [];
  clients: Client[] = [];
  isSubmitted: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getExistingProjectNames();
   this.getClients();
   this.getProjectStatuses();
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




getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


onSubmit() {
  this.isSubmitted = true;


    if (this.projectForm.invalid) {
      return;
    }


    const projectName: string = this.projectForm.get('projectName')?.value || '';
    const enddateString: string = this.projectForm.get('endDate')?.value || '';
    const startdateString: string = this.projectForm.get('startDate')?.value || '';
    const clientId: number = parseInt(this.projectForm.get('clientId')?.value ?? '0', 10);
    const projectStatusId: number = parseInt(this.projectForm.get('projectStatusId')?.value ?? '0', 10);
 
    const startDate: Date = startdateString ? new Date(startdateString) : new Date();
    const endDate: Date = enddateString ? new Date(enddateString) : new Date();
 
    if (this.existingProjectNames.includes(projectName)) {
                this.toast.error({detail: 'Error Message', summary: 'Project name already exists. Please enter a unique name.', duration: 5000
                });
         
                return;
              }
   
 
    if (endDate < startDate) {
      this.toast.error({ detail: 'Error Message', summary: 'End Date must be greater than or equal to Start Date.', duration: 5000 });
      return;
    }
 
    const project: Project = {
      projectId: 0,
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      clientId: clientId,
      projectStatusId: projectStatusId
    };
 
    this.dataService.addProject(project).subscribe((result) => {
      this.toast.success({ detail: 'Success Message', summary: 'Project added successfully', duration: 5000 });
      this.router.navigate(['/project']);
    },
    error => {
      this.toast.error({ detail: 'Error Message', summary: 'Project could not be added.', duration: 5000 });
     
    });
  }
 
}




