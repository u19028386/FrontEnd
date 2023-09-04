import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClaimCapture } from '../shared/claimCapture';
import { Employee } from '../shared/emp';
import { Project } from '../shared/pProject';
import { ProjectAllocation } from '../shared/pAllocation';
import { ClaimCaptureview } from '../shared/claimCaptureView';


@Injectable({
  providedIn: 'root'
})
export class ClaimcaptureService {
  apiUrl = 'https://localhost:7153/api/';


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private httpClient: HttpClient) { }


  getAllProjects(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetEmployeeProject`)
      .pipe(map(result => result))
 
  }


  getAllEmployees(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetEmployeeClaimCapture`)
      .pipe(map(result => result))
 
  }


  getAllAllocations(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjectAllocations`)
      .pipe(map(result => result))
 
  }


  getAllClaimItems(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClaimItems`)
      .pipe(map(result => result))
 
  }


  getAllClaimCaptures(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClaimCaptures`)
      .pipe(map(result => result))
 
  }
 
  addClaimCapture(claimCapture: ClaimCapture): Observable<ClaimCapture> {
    return this.httpClient.post< ClaimCapture>(`${this.apiUrl}MoTime/addClaimCapture`,claimCapture, this.httpOptions);
  }

}
