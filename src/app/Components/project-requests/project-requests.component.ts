import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { ProjectRequestViewModel } from 'src/app/shared/projectRequest';
import { ProjectRequestStatus } from 'src/app/shared/projectRequestStatus';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.css']
})
export class ProjectRequestsComponent implements OnInit {
  projectRequests: ProjectRequestViewModel[] = [];
  public userId!: string;
  projectRequestStatuses: ProjectRequestStatus[] = [];

  constructor(private apiService: APIService, private router: Router, private userStore: UserStoreService) {}

  ngOnInit(): void {
    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
      this.loadProjectRequests();
    });
    this.apiService.getAllProjectRequestStatuses().subscribe(statuses => {
      this.projectRequestStatuses = statuses;
    });
    // this.getProjectRequestObservable().subscribe(projectRequests => {
    //   console.log('Project Requestsssss:', projectRequests);
    //   this.projectRequests = projectRequests;
    // });

  }

  navigateToLogProjectRequest() {
    this.router.navigate(['/project-request']);
  }

  getProjectRequest(): void {
    this.getProjectRequestObservable().subscribe(projectRequests => {
      console.log('Project Requestsssss:', projectRequests);
      this.projectRequests = projectRequests;
    });
  }
  
  getProjectRequestObservable(): Observable<ProjectRequestViewModel[]> {
    return this.apiService.getEmployeeByUserId(this.userId).pipe(
      switchMap(employee => {
        return this.apiService.getAllProjectRequests().pipe(
          map((projectRequests: ProjectRequestViewModel[]) => {
            return projectRequests
              .filter(task => task.EmployeeId === employee.employeeId)
              .map(task => ({
                ...task,
                projectRequestStatusName: this.getStatusName(task.ProjectRequestStatusId),
              }));
          })
        );
      })
    );
  }
  getStatusName(projectRequestStatusId: number): string {
    const foundType = this.projectRequestStatuses.find(type => type.projectRequestStatusId === projectRequestStatusId);
    return foundType ? foundType.projectRequestStatusName : 'Unknown';
  }

  loadProjectRequests(): void {
    this.apiService.getAllProjectRequests().subscribe(
      (tasks: ProjectRequestViewModel[]) => {
        console.log('Project Requests loaded:', tasks);
        this.projectRequests = tasks
          .filter(task => task.EmployeeId === +this.userId)
          .map(task => ({
            ...task,
            projectRequestStatusName: this.getStatusName(task.ProjectRequestStatusId),
          }));
      },
      error => {
        console.log('Error loading the project requests:', error);
      }
    );
  }
}
