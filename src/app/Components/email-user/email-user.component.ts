import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/user';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-email-user',
  templateUrl: './email-user.component.html',
  styleUrls: ['./email-user.component.css']
})
export class EmailUserComponent implements OnInit{
  users: User[] = [];
  selectedEmployees: User[] = [];


  constructor(private userDataService:APIService,private toastService: NgToastService) {}
  ngOnInit(): void {
    this.loadEmployees();
  }


  loadEmployees(): void {
    this.userDataService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching employees:', error);
        this.toastService.error({
          detail: 'Error loading employees.',
          summary: 'An error occurred while loading employees from the database.',
          duration: 5000
        });
      }
    );
  }
 


  toggleEmployeeSelection(employee: User): void {
    if (this.selectedEmployees.includes(employee)) {
      this.selectedEmployees = this.selectedEmployees.filter((e) => e !== employee);
    } else {
      this.selectedEmployees.push(employee);
    }
  }


  launchOutlook(): void {
    if (this.users.length === 0) {
      this.toastService.error({
        detail: 'No employees loaded.',
        summary: 'Load employees before launching email.',
        duration: 5000
      });
      return;
    }
 
    const emailAddresses = this.selectedEmployees.map((employee) => employee.emailAddress);
 
    if (emailAddresses.length === 0) {
      this.toastService.error({
        detail: 'No selected employees.',
        summary: 'Select employees before launching email.',
        duration: 5000
      });
    } else {
      const mailtoLink = 'mailto:' + emailAddresses.join(';');
      window.location.href = mailtoLink;
 
      this.toastService.success({
        detail: 'Outlook launched successfully.',
        summary: 'Email launch successful.',
        duration: 5000
      });
    }
  }
}

