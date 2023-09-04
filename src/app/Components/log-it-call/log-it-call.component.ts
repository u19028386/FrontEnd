import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { APIService } from 'src/app/services/api.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-log-it-call',
  templateUrl: './log-it-call.component.html',
  styleUrls: ['./log-it-call.component.css']
})
export class LogItCallComponent implements AfterViewInit {
  isExpanded = false;
  timeStamp: string = '';
  email: string = '';
  itDepartments: any[] = [];
  isLoading = false;


  constructor(
    private datePipe: DatePipe,
    private itDepartmentService: APIService,
    private cdr: ChangeDetectorRef,
    private toast: NgToastService
  ) {}


  ngAfterViewInit(): void {
    this.updateTimeStamp();
    // Do not load email from the database here
  }


  expandContact() {
    this.isExpanded = !this.isExpanded;
 
    if (this.isExpanded) {
      this.updateTimeStamp(); // Update timestamp before generating the email link
      this.loadEmailFromDatabase();
    }
  }
 
  private updateTimeStamp() {
    const now = new Date();
    this.timeStamp = this.datePipe.transform(now, 'yyyy-MM-dd HH:mm:ss') || '';
  }


  loadEmailFromDatabase() {
    this.isLoading = true;


    this.itDepartmentService.GetITDepartment().subscribe({
      next: (itDepartments: any[]) => {
        this.itDepartments = itDepartments;
        if (itDepartments.length > 0 && itDepartments[0].email) {
          this.email = itDepartments[0].email;
          this.cdr.detectChanges();
        }
      },
    });
  }


  contactSupport() {
    if (this.email) {
      // Launch Outlook with email populated and show success toast
      window.location.href = `mailto:${this.email}?subject=IT%20Support%20Request&body=Timestamp:${this.timeStamp}`;
      this.toast.success({
        detail: 'Outlook Successfully Launched',
        summary: 'Outlook was successfully launched.',
        duration: 5000
      });
    } else {
      // Show error toast if email is not loaded
      this.toast.error({
        detail: 'Email Not Loaded',
        summary: 'The email address is not loaded. Please try again later.',
        duration: 5000
      });
    }
  }

}
