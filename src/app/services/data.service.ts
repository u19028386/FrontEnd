import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { Employeetype } from 'src/app/shared/employeetype';
import { NgToastService } from 'ng-angular-popup';
import { CalendarItem } from '../shared/calendaritem';
import { Eemployee } from '../shared/eemployee';
import { AddCalendarItem } from '../shared/addCalendarItem';

import { Resource } from '../shared/resource';
import { Project } from '../shared/project';
import { Client } from '../shared/client';
import { ProjectAllocation } from '../shared/projectAllocation';
import { ProjectAllocationView } from '../shared/projectAllocationView';
import { Employee2 } from '../shared/Employee2';
import { Resourcetype } from '../shared/resourceType';
import { EventReport } from '../shared/event-report';
import { MaxHour } from '../shared/maxHours';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  [x: string]: any;




  apiUrl = 'https://localhost:7153/api/';




  httpOptions ={
    headers: new HttpHeaders({
      // ContentType: 'application/json'
      'Content-Type': 'application/json'
    })
  }




  constructor(private httpClient: HttpClient,private toast: NgToastService ) {
  }

  getClaimItems(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClaimItems`).pipe(map(result => result));
  }


  getClaimItem(claimItemId: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.apiUrl}MoTime/GetClaimItem/${claimItemId}`)
    .pipe(map(result => result));
  }


  // client


  getClients(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClients`).pipe(map(result => result));
  }


  getClient(clientId: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.apiUrl}MoTime/GetClient/${clientId}`)
    .pipe(map(result => result));
  }


  addClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(`${this.apiUrl}MoTime/AddClient`, client, this.httpOptions);
  }


  editClient(clientId: number, client: Client){
    return this.httpClient.put(`${this.apiUrl}MoTime/EditClient/${clientId}`,client, this.httpOptions);
  }


  deleteClient(clientId: number) {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteClient` + "/" +clientId, this.httpOptions)
  }
 


  // project
  getProjects(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjects`)
    .pipe(map(result => result))
  }


  getProject(projectId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}MoTime/GetProject/${projectId}`);
  }


  addProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${this.apiUrl}MoTime/AddProject`, project, this.httpOptions);
  }


  editProject(projectId: number, project : Project) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditProject/${projectId}`, project, this.httpOptions);
  }


  deleteProject(projectId: Number)
  {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteProject` + "/" +projectId, this.httpOptions)
  }

  // employeetype
  getEmployeetype(employeeTypeId: number) {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetEmployeeType` + "/" + employeeTypeId)
    .pipe(map(result => result))
  }




  getEmployeeTypes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllEmployeeTypes`)
    .pipe(map(result => result))
  }


  addEmployeeType(employeeType: Employeetype): Observable<Employeetype> {
    return this.httpClient.post<Employeetype>(`${this.apiUrl}MoTime/AddEmployeeType`, employeeType, this.httpOptions);
  }


  editEmployeeType(employeeTypeId: number, type: Employeetype) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditEmployeeType/${employeeTypeId}`, type, this.httpOptions);
  }


 
  deleteEmployeeType(employeeTypeId: Number)
  {
   
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteEmployeeType` + "/" +employeeTypeId, this.httpOptions)
  }

// project status
getProjectStatuses(): Observable<any>{
  return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjectStatus`)
  .pipe(map(result => result))
}

 // employees
  getEmployees(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllEmployees`)
    .pipe(map(result => result))
  }


  getEmployee(employeeId: number): Observable<Eemployee> {
    return this.httpClient.get<Eemployee>(`${this.apiUrl}MoTime/GetEmployee/${employeeId}`);
  }




  addEmployee(eemployee: Employee2): Observable<Employee2> {
    return this.httpClient.post<Eemployee>(`${this.apiUrl}MoTime/AddEmployee`, eemployee, this.httpOptions);
  }


  editEmployee(employeeId: number, eemployee : Employee2) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditEmployee/${employeeId}`, eemployee, this.httpOptions);
  }




  deleteEmployee(employeeId: Number)
  {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteEmployee` + "/" +employeeId, this.httpOptions)
  }


  // calendar items
 
  getCalendarItem(calendarId: number): Observable<CalendarItem> {
    return this.httpClient.get<CalendarItem>(`${this.apiUrl}MoTime/GetCalendar/${calendarId}`);
  }


  addCalendarItem(calendarItem: CalendarItem): Observable<CalendarItem> {
    return this.httpClient.post<CalendarItem>(`${this.apiUrl}MoTime/AddCalendar`, calendarItem, this.httpOptions);
  }




  editCalendarItem(calendarId: number,calendarItem : AddCalendarItem) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditCalendar/${calendarId}`, calendarItem, this.httpOptions);
  }


  deleteCalendarItem(calendarId: Number)
  {
    this.toast.success({detail:'Delete Message',summary:'Successfully deleted calendar item.', duration:5000});
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteCalendar` + "/" + calendarId, this.httpOptions)
  }


  // users
  getUsers(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}Authentication/GetAllUsers`)
    .pipe(map(result => result))
  }




  // employee status
  getEmployeeStatuses(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllEmployeeStatuses`)
    .pipe(map(result => result))
  }


  // regions
  getRegions(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllRegions`)
    .pipe(map(result => result))
  }


  // divisions
  getDivisions(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllDivisions`)
    .pipe(map(result => result))
  }


  // manager types
  getManagerTypes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllManagerTypes`)
    .pipe(map(result => result))
  }


  // resources
  

  // resources
  getResources(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllResources`)
    .pipe(map(result => result))
  }


  addResource(resource: Resource): Observable<Resource> {
    return this.httpClient.post<Resource>(`${this.apiUrl}MoTime/AddResource`, resource, this.httpOptions);
  }


  getResource(resourceId: number): Observable<Resource> {
    return this.httpClient.get<Resource>(`${this.apiUrl}MoTime/GetResource/${resourceId}`);
  }
 
  editResource(resourceId: number,resource : Resource) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditResource/${resourceId}`, resource, this.httpOptions);
  }


  deleteResource(resourceId: Number)
  {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteResource` + "/" + resourceId, this.httpOptions)
  }


  //  // calendars
   getCalendars(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllCalendars`)
    .pipe(map(result => result))
  }


   // calendars
   getTitles(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllTitles`)
    .pipe(map(result => result))
  }



   // project allocations
   getProjectAllocations(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjectAllocations`)
    .pipe(map(result => result))
  }


  addProjectAllocation(projectAllocation: ProjectAllocation): Observable<ProjectAllocation> {
    return this.httpClient.post< ProjectAllocation>(`${this.apiUrl}MoTime/AddProjectAllocation`,  projectAllocation, this.httpOptions);
  }


  getProjectAllocation(projectAllocationId: number): Observable<ProjectAllocation> {
    return this.httpClient.get<ProjectAllocation>(`${this.apiUrl}MoTime/GetProjectAllocation/${projectAllocationId}`);
  }




  deleteProjectAllocation(projectAllocationId: Number)
  {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteProjectAllocation` + "/" + projectAllocationId, this.httpOptions)
  }

  getResourcetype(resourceTypeId: number) {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetResourceType` + "/" + resourceTypeId).pipe(map(result => result))
  }




  getResourceTypes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllResourceTypes`)
    .pipe(map(result => result))
  }


  addResourceType(resourceType: Resourcetype): Observable<Resourcetype> {
    return this.httpClient.post<Resourcetype>(`${this.apiUrl}MoTime/AddResourceType`, resourceType, this.httpOptions);
  }


  editResourceType(resourceTypeId: number, resourceType: Resourcetype) {
    return this.httpClient.put(`${this.apiUrl}MoTime/EditResourceType/${resourceTypeId}`, resourceType, this.httpOptions);
  }


  deleteResourceType(resourceTypeId: Number)
  {
    return this.httpClient.delete<string>(`${this.apiUrl}MoTime/DeleteResourceType` + "/" + resourceTypeId, this.httpOptions)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////// Business Rule /////////////////////////////////////////////////////
  // events
  getEventHours(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllEventReports`).pipe(map(result => result));
  }


  getEventHour(id: number): Observable<EventReport> {
    return this.httpClient.get<EventReport>(`${this.apiUrl}MoTime/GetEventReport/${id}`)
    .pipe(map(result => result));
  }
  // max
  getMaximums(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllMaxHours`).pipe(map(result => result));
  }


  getMaximum(maxHoursId: number): Observable<MaxHour> {
    return this.httpClient.get<MaxHour>(`${this.apiUrl}MoTime/GetMaximumHour/${maxHoursId}`)
    .pipe(map(result => result));
  }





}
