import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from 'src/app/shared/client';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://localhost:7153/api/'; // Replace this with your API endpoint


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };




  constructor(private httpClient: HttpClient) { }
//Get all resource
  GetAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.apiUrl}MoTime/GetAllClients`);
  }
//Get resource by id
  getClientById(resourceId: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.apiUrl}MoTime/GetClientById/${resourceId}`);
  }


//Add Resource
  // addClient(client: FormData): Observable<Client> {
  //   return this.httpClient.post<Client>(`${this.apiUrl}MoTime/AddClient`, client, this.httpOptions);
  // }
  addClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(`${this.apiUrl}/MoTime/AddClient`, client);
  }
//Edit Resource
  editClient(client: number, resource: FormData): Observable<Client> {
    return this.httpClient.put<Client>(`${this.apiUrl}MoTime/EditClient/${client}`, resource, this.httpOptions);
  }
//Delete resource
  deleteClient(clientId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteClient/${clientId}`, this.httpOptions);
  }
}