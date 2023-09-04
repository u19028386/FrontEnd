import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private userId$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRole()
  {
    return this.role$.asObservable();
  }
  public setRole(role: string)
  {
    this.role$.next(role);
  }
  public getFullName()
  {
    return this.fullName$.asObservable();
    
  }
  public setFullName(fullname: string)
  {
    this.fullName$.next(fullname);
  }
  public getUserId()
  {
    return this.userId$.asObservable();
    
  }
  public setUserId(userId: string)
  {
    this.userId$.next(userId);
  }
}
