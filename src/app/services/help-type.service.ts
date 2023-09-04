import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpType } from 'src/app/shared/helpType';


@Injectable({
  providedIn: 'root'
})
export class HelpTypeService {
  apiUrl = 'https://localhost:7153/api/';


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private httpClient: HttpClient) { }


  // Get all help types
GetAllHelpType(): Observable<HelpType[]> {
  return this.httpClient.get<HelpType[]>(`${this.apiUrl}MoTime/GetAllHelpType`);
}


// Get help type by id
GetHelpType(helpTypeId: number): Observable<HelpType> {
  return this.httpClient.get<HelpType>(`${this.apiUrl}MoTime/GetHelpType/${helpTypeId}`);
}


// Add help type
AddHelpType(helpType: HelpType): Observable<HelpType> {
  return this.httpClient.post<HelpType>(`${this.apiUrl}MoTime/AddHelpType`, helpType, this.httpOptions);
}


// Edit help type
EditHelpType(helpTypeId: number, helpType: HelpType): Observable<HelpType> {
  return this.httpClient.put<HelpType>(`${this.apiUrl}MoTime/EditHelpType/${helpTypeId}`, helpType, this.httpOptions);
}


// Delete help type
DeleteHelpType(helpTypeId: number): Observable<any> {
  return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteHelpType/${helpTypeId}`, this.httpOptions);
}


}
