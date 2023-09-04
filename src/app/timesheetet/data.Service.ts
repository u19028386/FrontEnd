import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EmployeeReportVM, Events } from './Event';
import { Project, ProjectAllocation, User } from './Employees';


@Injectable()
export class DataService {


   
  constructor(private http: HttpClient) {
  }
  httpOptions = {


    headers: new HttpHeaders({


      'Content-Type': 'application/json'


    })


  };
  getEvents(from: DayPilot.Date, to: DayPilot.Date, employeeId: string): Observable<any[]> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('employee', employeeId);


    return this.http.get<any[]>("https://localhost:7153/api/Events", { params });
  }


  getEmployees(): Observable<User[]> {
    return this.http.get<User[]>('https://localhost:7153/api/Projects/Employees');
  }  


  getProjects(): Observable<Project[]>{
    return this.http.get<Project[]>('https://localhost:7153/api/Projects');
  }


  addEvent(newEvent: Events): Observable<any> {
    console.log(newEvent);
    return this.http.post<Events>('https://localhost:7153/api/Events', newEvent, this.httpOptions);
  }


  updateEvent(id: number, updatedEvent: Events): Observable<any> {
    return this.http.put<any>(`https://localhost:7153/api/Events/${id}`, updatedEvent);
  }


  submitTimesheetEvent(id: number, month: number): Observable<void> {
    const body = { id: id, month: month };
    console.log(body);
    return this.http.post<void>(`https://localhost:7153/api/Events/SubmitTimeSheet`, body, this.httpOptions);
  }




  isTbmittable(employeeId: number, month: number): Observable<boolean> {
    return this.http.get<boolean>(`https://localhost:7153/api/Events/Employee/${employeeId}/Months/${month}/isTbmittable`);
  }






 getALlTimesheet(): Observable<any[]>{
  return this.http.get<any[]>('https://localhost:7153/api/Events/GetAllSubmittedTimeSheets');
 }




  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`https://localhost:7153/api/Events/${id}`);
  }


  GetEmployeeProjects(employeeId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`https://localhost:7153/api/Projects/ProjectsByEmployee/${employeeId}`);
  }
  getEmployee(employeeId: number): Observable<User> {
    const url = `https://localhost:7153/api/Events/Employee/${employeeId}`;
    return this.http.get<User>(url);
  }


  PostAccptOrReject(timesheetId: number, statusId: number): Observable<void> {
    const body = { timesheetId: timesheetId, statusId: statusId };
    console.log(body);
    return this.http.post<void>(`https://localhost:7153/api/Events/UpdateTimeSheetStatus`, body, this.httpOptions);
  }


  GetEmployeeProjectAllocationHours(employeeId: number, projectId: number): Observable<ProjectAllocation> {
    return this.http.get<ProjectAllocation>(`https://localhost:7153/api/Events/Employee/${employeeId}/Project/${projectId}/AllocationHours`);
  }


  GetEmployeeProjecReport(employeeId: number, month: number): Observable<EmployeeReportVM> {
    return this.http.get<EmployeeReportVM>(`https://localhost:7153/api/Events/Employee/${employeeId}/Month/${month}/EmployeeReport`);
  }


  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7153/api/Events/${id}`);
  }

}




