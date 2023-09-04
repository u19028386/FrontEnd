import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClaimItem } from '../shared/claimItem';
import { ClaimType } from '../shared/claimType';

@Injectable({
  providedIn: 'root'
})
export class ClaimServiceService  {

  apiUrl = 'https://localhost:7153/api/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private httpClient: HttpClient) { }


  // Method to get all claim items
  getAllClaimItems(): Observable<ClaimItem[]> {
    return this.httpClient.get<ClaimItem[]>(`${this.apiUrl}MoTime/GetAllClaimItems`);
  }


  // Method to get a specific claim item by ID
  getClaimItem(ClaimItemId: number): Observable<ClaimItem> {
    return this.httpClient.get<ClaimItem>(`${this.apiUrl}MoTime/GetClaimItem/${ClaimItemId}`);
  }


  // Method to add a new claim item
  addClaimItem(claimItem: ClaimItem): Observable<ClaimItem> {
    return this.httpClient.post<ClaimItem>(`${this.apiUrl}MoTime/AddClaimItem`, claimItem, this.httpOptions);
  }


  // Method to update an existing claim item
  updateClaimItem(ClaimItemId: number, claimItem: ClaimItem): Observable<ClaimItem> {
    return this.httpClient.put<ClaimItem>(`${this.apiUrl}MoTime/UpdateClaimItem/${ClaimItemId}`, claimItem, this.httpOptions);
  }






  // Method to delete a claim item
  deleteClaimItem(ClaimItemId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteClaimItem/${ClaimItemId}`, this.httpOptions);
  }

  getAllClaimTypes(): Observable<ClaimType[]> {
    return this.httpClient.get<ClaimType[]>(`${this.apiUrl}MoTime/GetAllClaimTypes`);
  }


  getClaimType(claimTypeId: number): Observable<ClaimType> {
    return this.httpClient.get<ClaimType>(`${this.apiUrl}MoTime/GetClaimType/${   claimTypeId}`);
  }


  addClaimType(claimType: ClaimType): Observable<ClaimType> {
    return this.httpClient.post<ClaimType>(`${this.apiUrl}MoTime/AddClaimType`, claimType, this.httpOptions);
  }


  updateClaimType(claimTypeId: number, claimType: ClaimType): Observable<ClaimType> {
    return this.httpClient.put<ClaimType>(`${this.apiUrl}MoTime/UpdateClaimType/${   claimTypeId}`, claimType, this.httpOptions);
  }


  deleteClaimType(claimTypeId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteClaimType/${   claimTypeId}`, this.httpOptions);
  }
}

