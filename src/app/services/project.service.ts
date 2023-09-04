import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectViewModel } from 'src/app/shared/project';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7153/api/'; // Replace this with your API endpoint


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }
//Get all projects
  GetAllProjects(): Observable<ProjectViewModel[]> {
    return this.httpClient.get<ProjectViewModel[]>(`${this.apiUrl}MoTime/GetAllProject`);
  }
  //GetAllProjects(): Observable<any> {
    //return this.httpClient.get<ProjectViewModel[]>(`${this.apiUrl}NewAPI/GetAllProject`);
  //}
//Get project by id
  getProjectById(ProjectId: number): Observable<ProjectViewModel> {
    return this.httpClient.get<ProjectViewModel>(`${this.apiUrl}MoTime/GetProjectById/${ProjectId}`);
  }


//Add Project
  addProject(project: ProjectViewModel): Observable<ProjectViewModel> {
    return this.httpClient.post<ProjectViewModel>(`${this.apiUrl}MoTime/AddProject`, project, this.httpOptions);
  }
//Edit Project
  editResourceType(id: number, resourceType: ProjectViewModel): Observable<ProjectViewModel> {
    return this.httpClient.put<ProjectViewModel>(`${this.apiUrl}MoTime/EditProject/${id}`, resourceType, this.httpOptions);
  }
//Delete project
  deleteResourceType(ProjectId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteProject/${ProjectId}`, this.httpOptions);
  }
}
