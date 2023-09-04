import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { APIService } from './services/api.service';

Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private toastr: ToastrService, private apiService: APIService) {}
  canActivate(): boolean{
    if(this.apiService.IsLoggedIn())
    {
      return true;
    }
    else{
      this.router.navigate(['login']);
      return false;
    }
  }
}
