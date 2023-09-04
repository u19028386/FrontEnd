import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';


import { AddCalendarItem } from 'src/app/shared/addCalendarItem';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CalendarItem } from 'src/app/shared/calendaritem';
import { EditConfirmationModalComponent } from '../../edit-confirmation-modal/edit-confirmation-modal.component';


@Component({
  selector: 'app-edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.css']
})
export class EditCalendarComponent implements OnInit {
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;
  calendarForm = new FormGroup(
    {
      calendarItemName: new FormControl('', Validators.required),
      calendarItemDescription: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      date: new FormControl<Date | null>(null, Validators.required),
      startTime: new FormControl<Date | null>(null, Validators.required),
      endTime: new FormControl<Date | null>(null, Validators.required)
    });


  calendarItem: CalendarItem | null = null;
  showModal: boolean = false;


  calendarItems : CalendarItem[] = [];
  existingAccounts: string[] = [];
  originalCalendarItemName: string | null = null;
  originalCalendarItemDescription: string | null = null;
  originalLocation: string | null = null;
  originalDate: Date | null = null;
  originalStartTime: Date | null = null;
  originalEndTime: Date | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  displayModal: boolean = false;




  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {}
   
ngOnInit(): void {
  this.dataService.getCalendarItem(+this.route.snapshot.params['calendarItemId']).subscribe((result) => {
    this.calendarItem = result as CalendarItem;
    if (this.calendarItem) {
                  this.originalCalendarItemName = this.calendarItem.calendarItemName;
                  this.originalCalendarItemDescription = this.calendarItem.calendarItemDescription;
                  this.originalLocation = this.calendarItem.location;
                  this.originalDate = this.calendarItem.date;
                  this.originalStartTime = this.calendarItem.startTime;
                  this.originalEndTime = this.calendarItem.endTime;
     
                  this.calendarForm.patchValue({
                      calendarItemName: this.calendarItem.calendarItemName || '',
                      calendarItemDescription: this.calendarItem.calendarItemDescription || '',
                      location: this.calendarItem.location || '',
                      date: this.calendarItem.date,
                      startTime: this.calendarItem.startTime,
                      endTime: this.calendarItem.endTime
      });
    }
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


  openEditModal(calendarItem: CalendarItem) {
        this.itemToEdit = calendarItem.calendarItemName;
        this.displayModal = true;
      }
   
  closeModal() {
        this.displayModal = false;
      }


  editConfirmed() {
        if (!this.calendarItem) {
          return;
        }


        const dateString = this.calendarForm.value.date;
        const date = dateString ? new Date(dateString) : new Date();
        const startTimeString = this.calendarForm.value.startTime;
        const startTime = startTimeString ? new Date(startTimeString) : new Date();
        const endTimeString = this.calendarForm.value.endTime;
        const endTime = endTimeString ? new Date(endTimeString) : new Date();
     
        startTime.setHours(startTime.getHours() + 2);
        endTime.setHours(endTime.getHours() + 2);
     
        const now = new Date();
     
        if ((endTime <= now) && date.toDateString() === now.toDateString()) {
          this.toast.error({
            summary: 'End time must be in the future for today\'s date.',
            detail: 'Error Message'
          });
          return;
        }


        if ((startTime <= now ) && date.toDateString() === now.toDateString()) {
          this.toast.error({
            summary: 'Start time must be in the future for today\'s date.',
            detail: 'Error Message'
          });
          return;
        }


        if ((startTime <= now && endTime <= now) && date.toDateString() === now.toDateString()) {
          this.toast.error({
            summary: 'Start and end times must be in the future for today\'s date.',
            detail: 'Error Message'
          });
          return;
        }


        if (endTime <= startTime) {
          this.toast.error({
            summary: 'End time must be greater than start time.',
            detail: 'Error Message'
          });
          return;
        }


        if (
          this.calendarForm.value.calendarItemName === this.originalCalendarItemName &&
          this.calendarForm.value.calendarItemDescription === this.originalCalendarItemDescription &&
          this.calendarForm.value.date === this.originalDate &&
          this.calendarForm.value.location === this.originalLocation &&
          this.calendarForm.value.startTime === this.originalStartTime &&
          this.calendarForm.value.endTime === this.originalEndTime
        ) {
          this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the calendar item.', duration: 5000 });
          return;
        }
     
        const updatedCalendarItem: CalendarItem = {
          calendarId: this.calendarItem.calendarId,
          calendarItemName: this.calendarForm.value.calendarItemName || '',
          calendarItemDescription: this.calendarForm.value.calendarItemDescription || '',
          location: this.calendarForm.value.location || '',
          date: this.calendarForm.value.date ?? new Date(),
          endTime: this.calendarForm.value.endTime ?? new Date() ,
          startTime: this.calendarForm.value.startTime ?? new Date()
        };
     
        this.dataService.editCalendarItem(this.calendarItem.calendarId, updatedCalendarItem).subscribe(
          (result) => {
            this.toast.success({ detail: 'Success Message', summary: 'Calendar item updated successfully', duration: 5000 });
            this.itemToEdit = '';
            this.closeModal();
            this.router.navigate(['/mycalendar']);
          },
          (error) => {
            this.toast.error({ detail: 'Error Message', summary: 'Failed to update calendar item.', duration: 5000 });
          }
        );
      }
     
     
    }
