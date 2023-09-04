import { Component, AfterContentChecked, ViewChild, OnInit, Renderer2, ElementRef , Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { APIService } from './services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { NotificationComponentComponent } from './Components/notification-component/notification-component.component';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // for notification
  @ViewChild(NotificationComponentComponent, { static: true })
  private notificationComponent!: NotificationComponentComponent;
  //end
  title = 'NewEmployeeCalendar';
  showWarning: boolean = false;
  loggedIn: boolean = true;
  timeoutId: any;
  showAlert: boolean = false;
  isSidebarCollapsed: boolean = false;
 


  notificationMessage!: string;


  showReminder: boolean = false;


 
  showToast: boolean = false;


  constructor(private renderer: Renderer2, private elementRef: ElementRef, private toast: NgToastService, private apiService: APIService) {
   
    this.resetTimer();


     ['mousemove', 'mousedown', 'keypress', 'touchstart'].forEach((event) => {
       this.renderer.listen('window', event, () => this.resetTimer());
     });
   }


   resetTimer() {
     clearTimeout(this.timeoutId);
     this.showWarning = false;


     this.timeoutId = setTimeout(() => {
       this.showWarning = true;
     }, 120000);
 }




ngOnInit() {
  setInterval(() => {
    if (!this.showToast) {
      this.showToast = true;
      this.toast.info({detail:'Reminder', summary:'Please capture your time', duration: 2000});
    }
  }, 5000); // 10000 milliseconds = 10 seconds
}


hideToast() {
  this.showToast = false;
 }

 isLoggedIn()
 {
  if(this.apiService.IsLoggedIn())
  {
    return true;
  }
  else{
    return false;
  }
 }

 toggleSidebar() {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}
}

