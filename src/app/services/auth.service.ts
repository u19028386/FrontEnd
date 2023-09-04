import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPayload: any;

  apiUrl = 'https://localhost:7153/api/'

  constructor(private httpClient: HttpClient, private router: Router) {
    this.userPayload = this.decodeJwtToken();
   }

   getToken()
   {
     return localStorage.getItem('token');
   }
   isLoggedIn(): boolean{
     return !!localStorage.getItem('token');
   }
   decodeJwtToken() {
     const jwtHelper = new JwtHelperService();
     const token = this.getToken()!;
     console.log(jwtHelper.decodeToken(token))
     return jwtHelper.decodeToken(token);
   } 
   getUserIdFromToken(): string | undefined {
    if (this.userPayload && this.userPayload.userId) {
      return this.userPayload.userId;
    } else {
      // Handle the case where role is missing or undefined
      return undefined;
    }
  }
}
