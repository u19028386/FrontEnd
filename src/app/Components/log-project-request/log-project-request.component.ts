import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectRequestViewModel } from 'src/app/shared/projectRequest';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';
import { ProjectRequestStatus } from 'src/app/shared/projectRequestStatus';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-log-project-request',
  templateUrl: './log-project-request.component.html',
  styleUrls: ['./log-project-request.component.css']
})
export class LogProjectRequestComponent implements OnInit{
  public employeeId!: number;
  projectRequestStatuses: ProjectRequestStatus[] = [];
  public userId!: string;
  public newTask: ProjectRequestViewModel = {} as ProjectRequestViewModel;

  constructor(private router: Router, 
    private apiService: APIService,
    private userStore: UserStoreService,) {}

  ngOnInit(): void {
    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
    });
    this.apiService.getAllProjectRequestStatuses().subscribe((projectRequestStatuses: ProjectRequestStatus[]) => {
      this.projectRequestStatuses = projectRequestStatuses;
      console.log(this.projectRequestStatuses); // Check if priorities are populated
    });
  }
  logProjectRequest(requ: ProjectRequestViewModel): void {
    // Fetch employee using userId
    this.apiService.getEmployeeByUserId(this.userId).subscribe(
      (employee) => {
        // Create a new task with employeeId from the fetched employee
        const newTask: ProjectRequestViewModel = {
          ...requ,
          EmployeeId: employee.employeeId, // Use employee's employeeId
          ProjectRequestDate: new Date(),
          ProjectRequestStatusId: 1,
        };
  
        // Add the task using the employeeId
        this.apiService.logProjectRequest(newTask).subscribe(() => {
          console.log("Successfully logged a project request!");
          this.router.navigate(['/project-requests']);
          // Refresh task list after adding
          // Reset form fields
          this.newTask = {} as ProjectRequestViewModel;
        }, error => {
          // Handle error
        });
      },
      error => {
        // Handle error fetching employee details
      }
    );
  }

  cancel() {
    this.router.navigate(['/project-requests']);
  }
}
