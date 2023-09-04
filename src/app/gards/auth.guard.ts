import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private apiService: APIService, private toastr: NgToastService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.apiService.IsLoggedIn()) {
      return true;
    } else {
      // If the user is not logged in, redirect them to the login page
      this.toastr.error({detail: "ERROR", summary: "Please login first"});
      this.router.navigate(['login']);
      return false;
    }
  }
}
