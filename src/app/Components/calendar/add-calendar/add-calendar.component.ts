import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarItem } from 'src/app/shared/calendaritem';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-add-calendar',
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.css'],
})
export class AddCalendarComponent implements OnInit {
  calendarForm = new FormGroup({
    calendarItemName: new FormControl('', Validators.required),
    calendarItemDescription: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    date: new FormControl ('', Validators.required),
    startTime: new FormControl ('', Validators.required),
    endTime: new FormControl ('', Validators.required)
  });


  existingCalendarNames: string[] = [];
  isSubmitted: boolean = false;


  constructor(private dataService: DataService, private router: Router,private toast: NgToastService) {
  }


  ngOnInit(): void {
    this.getExistingEmployeeTypeNames();
  }


 
  getExistingEmployeeTypeNames() {
    this.dataService.getCalendars().subscribe((calendarItems: CalendarItem[]) => {
      this.existingCalendarNames = calendarItems
        .map((calendarItem) => calendarItem.calendarItemName)
        .filter((name) => name !== null) as string[];
    });
  }


  cancel() {
    this.router.navigate(['/mycalendar']);
  }


  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onSubmit() {
    this.isSubmitted = true;


    if (this.calendarForm.invalid) {
      return;
    }


    const calendarItemName: string = this.calendarForm.get('calendarItemName')?.value || '';
    const calendarItemDescription: string = this.calendarForm.get('calendarItemDescription')?.value || '';
    const location: string = this.calendarForm.get('location')?.value || '';
    const dateString: string = this.calendarForm.get('date')?.value || '';
    const dateString1: string = this.calendarForm.get('startTime')?.value || '';
    const dateString2: string = this.calendarForm.get('endTime')?.value || '';


    const date: Date = dateString ? new Date(dateString) : new Date();
    const startTime: Date = dateString1 ? new Date(dateString1) : new Date();
    const endTime: Date = dateString2 ? new Date(dateString2) : new Date();


    // Add 2 hours to the start time and end time because system is off by two hours
    startTime.setHours(startTime.getHours() + 2);
    endTime.setHours(endTime.getHours() + 2);


    const now = new Date(); // Get the current time


    if (date.toDateString() === now.toDateString()) {
      if (startTime <= now && endTime <= now) {
        this.toast.error({ detail: 'Error Message', summary: 'Start and end times must be in the future for today\'s date.' });
        return;
      }  if (startTime <= now) {
        this.toast.error({ detail: 'Error Message', summary: 'Start time must be in the future for today\'s date.' });
        return;
      }


      else if (endTime <= startTime) {
        this.toast.error({ detail: 'Error Message', summary: 'End time must be greater than start time.' });
        return;
      }
    }


    if (date.toDateString() != now.toDateString()) {
      if (endTime <= startTime) {
        this.toast.error({ detail: 'Error Message', summary: 'End time must be greater than start time.' });
        return;
      }
 
    }


    if (this.existingCalendarNames.includes(calendarItemName)) {
      this.toast.error({ detail: 'Error Message', summary: 'Calendar item name already exists. Please enter a unique name.', duration: 5000 });
      return;
    }


    const calendarItem: CalendarItem = {
      calendarId: 0,
      calendarItemName: calendarItemName,
      calendarItemDescription: calendarItemDescription,
      location: location,
      date: date,
      startTime: startTime,
      endTime: endTime,
    };


    this.dataService.addCalendarItem(calendarItem).subscribe(result => {
      this.toast.success({ detail: 'Success Message', summary: 'Calendar item added successfully.', duration: 5000 });
      this.router.navigate(['/mycalendar']);
    },
    error => {
      this.toast.error({ detail: 'Error Message', summary: 'Calendar item could not be added.', duration: 5000 });
     
    }
    );
  }

}
