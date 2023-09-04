import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceViewModel } from 'src/app/shared/resource2';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = 'https://localhost:7153/api/'; // Replace this with your API endpoint


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };




  constructor(private httpClient: HttpClient) { }
//Get all resource
  GetAllResources(): Observable<ResourceViewModel[]> {
    return this.httpClient.get<ResourceViewModel[]>(`${this.apiUrl}MoTime/GetAllResource`);
  }
//Get resource by id
  getResourceById(resourceId: number): Observable<ResourceViewModel> {
    return this.httpClient.get<ResourceViewModel>(`${this.apiUrl}MoTime/GetResourceById/${resourceId}`);
  }


//Add Resource
  addResource(resource: FormData): Observable<ResourceViewModel> {
    return this.httpClient.post<ResourceViewModel>(`${this.apiUrl}MoTime/AddResource`, resource, this.httpOptions);
  }
//Edit Resource
  editResource(resourceId: number, resource: FormData): Observable<ResourceViewModel> {
    return this.httpClient.put<ResourceViewModel>(`${this.apiUrl}MoTime/EditResource/${resourceId}`, resource, this.httpOptions);
  }
//Delete resource
  deleteResource(resourceId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteResource/${resourceId}`, this.httpOptions);
  }
}
