import { Component, OnInit } from '@angular/core';
import { CalendarDay } from 'src/app/shared/calendarDay';
import { NgToastService } from 'ng-angular-popup';
import { IToast } from 'ng-angular-popup/lib/toast.model';
import { DataService } from 'src/app/services/data.service';
import { CalendarItem } from 'src/app/shared/calendaritem';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Calendar } from 'src/app/shared/calendar';
import { DatePipe } from '@angular/common';
import { ChunkPipe } from 'src/app/Components/chunk.pipe';


interface UpcomingEvent {
  calendarItemName: string;
  date: Date;
}




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendaritems: CalendarItem[] = [];
  filtered: CalendarItem[] = [];
  searchName: string = '';

  public calendar: CalendarDay[] = [];
  public events: { date: Date, title: string }[] = [];
  public monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  public currentMonth!: number;
  public currentYear!: number;
  // public searchText!: string;
  public nextDayEvents: { date: Date, title: string }[] = [];
  public tableEvents: { date: Date, item: CalendarItem }[] = [];
  upcomingEventsForNextDay: CalendarItem[] = [];
  todayEventsForNextDay: CalendarItem[] = [];
  fridayEvents: Calendar[] = [];
  calendars: Calendar[] = [];
  upcomingEvents: any[] = [];
  todayEvents : any[] = [];

  constructor(private toast: NgToastService, private dataService: DataService) {}

  ngOnInit(): void {
  const today = new Date();
  this.currentMonth = today.getMonth();
  this.currentYear = today.getFullYear();
  this.generateCalendarDays(this.currentMonth, this.currentYear);
  this.getCalendarItems();
  this.fetchCalendarItems();

  this.upcomingEventsForNextDay = this.getUpcomingEventsForNextDay(today);
  this.todayEventsForNextDay = this.getTodayEventsForNextDay(today);
  
}

fetchCalendarItems() {
  this.dataService.getCalendars().subscribe(
    (calendarItems) => {
      this.calendaritems = calendarItems; // Assign the fetched data to the calendarItems array
      this.filterUpcomingEvents(calendarItems);
    },
    (error) => {
      console.error('Error fetching calendar items:', error);
      // Handle error if needed
    }
  );
}

filterUpcomingEvents(calendarItems: any[]) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date

  const dToday = new Date();
  dToday.setDate(dToday.getDate());

  // Filter the calendar items to get events happening tomorrow
  this.upcomingEvents = calendarItems.filter((item) => {
    const eventDate = new Date(item.date);
    // Check if the event date is equal to tomorrow's date
    return eventDate.toDateString() === tomorrow.toDateString();
  });

  this.todayEvents = calendarItems.filter((item) => {
    const eventDate = new Date(item.date);
    // Check if the event date is equal to tomorrow's date
    return eventDate.toDateString() === dToday.toDateString();
  });
}



  checkAndDisplayAlerts(calendarItems: any[]) {
    const today = new Date(); // Get the current date

    // Loop through the calendar items and check if any event is today or in the future
    calendarItems.forEach((item: { date: string | number | Date; calendarItemName: any; }) => {
      const eventDate = new Date(item.date);

      if (eventDate >= today) {
        // Display a toaster alert with the event information
        const message = `Event "${item.calendarItemName}" at ${item.date}`;
        this.showToasterAlert(message);
      }
    });
  }

  showToasterAlert(message: string) {
  
   console.log(message);
  }

private getUpcomingEventsForNextDay(today: Date): CalendarItem[] {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

  return this.calendaritems.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === tomorrow.getFullYear() &&
      itemDate.getMonth() === tomorrow.getMonth() &&
      itemDate.getDate() === tomorrow.getDate()
    );
  });
}

private getTodayEventsForNextDay(today: Date): CalendarItem[] {
  const dtoday = new Date(today);
  dtoday.setDate(today.getDate());
  dtoday.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

  return this.calendaritems.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === dtoday.getFullYear() &&
      itemDate.getMonth() === dtoday.getMonth() &&
      itemDate.getDate() === dtoday.getDate()
    );
  });
}

  getCalendarItems() {
    this.dataService.getCalendars().subscribe((result: CalendarItem[]) => {
      this.calendaritems = result;
      this.filtered = result;
      this.filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // Clear the events and tableEvents array before re-populating
      this.events = [];
      this.tableEvents = [];
  
      result.forEach(item => {
        const date = new Date(item.date);
        this.events.push({ date, title: item.calendarItemName.toString() });
        this.tableEvents.push({ date, item });
      });
  
      this.filterEventsByMonth();
    });
  }
  

  deleteCalendarItem(calendarId: number) {
    this.dataService.deleteCalendarItem(calendarId).subscribe(result => {
      this.toast.success({ detail: 'Success Message', summary: 'Calendar item deleted successfully.', duration: 5000 });
      window.location.reload();
    });
  }


  search(): void {
    if (!this.searchName) {
      this.toast.error({ detail: 'Error Message', summary: 'Please enter a search term.', duration: 5000 });
      return;
    }
  
    this.filtered = this.calendaritems.filter((calendaritem) =>
    calendaritem.calendarItemName && calendaritem.calendarItemName .toLowerCase().includes(this.searchName.toLowerCase())

    );

  }

  private filterEventsByMonth(): void {
    const monthStart = new Date(this.currentYear, this.currentMonth, 1);
    const monthEnd = new Date(this.currentYear, this.currentMonth + 1, 0);
  
    this.filtered = this.calendaritems.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= monthStart && itemDate <= monthEnd;
    });
  }
  

  
  private generateCalendarDays(month: number, year: number): void {
    this.calendar = [];
  
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
  
    const startingDateOfCalendar = this.getStartDateForCalendar(firstDayOfMonth);
    let dateToAdd = startingDateOfCalendar;
  
    while (dateToAdd.getMonth() <= month && dateToAdd <= lastDayOfMonth) {
      const calendarDay = new CalendarDay(new Date(dateToAdd));
  
      const matchingTableEvents = this.tableEvents.filter(event => event.date.getTime() === calendarDay.date.getTime());
      const matchingMainEvents = this.getEventsForDate(calendarDay.date);
  
      const combinedEvents: Set<string> = new Set<string>();
  
      matchingTableEvents.forEach(event => combinedEvents.add(event.item.calendarItemName.toString()));
      matchingMainEvents.forEach(event => combinedEvents.add(event.title));
  
      if (combinedEvents.size > 0) {
        calendarDay.events = Array.from(combinedEvents);
      }
  
      this.calendar.push(calendarDay);
      dateToAdd.setDate(dateToAdd.getDate() + 1);
    }
  }
  

  private getStartDateForCalendar(selectedDate: Date) {
    const startingDateOfCalendar = new Date(selectedDate);
    startingDateOfCalendar.setDate(1);

    if (startingDateOfCalendar.getDay() !== 1) {
      do {
        startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1);
      } while (startingDateOfCalendar.getDay() !== 1);
    }

    return startingDateOfCalendar;
  }

  public goToPreviousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendarDays(this.currentMonth, this.currentYear);
    this.filterEventsByMonth();
  }

  public goToNextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendarDays(this.currentMonth, this.currentYear);
    this.filterEventsByMonth();
  }

  public hasEvent(date: Date): boolean {
    const calendarDay = this.calendar.find((day) => day.date.getTime() === date.getTime());
    return !!calendarDay?.events?.length;
  }

  

  public addEvent(date: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);


  }
  
  private getEventsForDate(date: Date): { date: Date, title: string }[] {
    return this.events.filter((event) => event.date.getTime() === date.getTime());
  }

  showItemsForDate(selectedDate: Date): void {
    const selectedDateEvents = this.calendaritems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === selectedDate.toDateString();
    });

    if (selectedDateEvents.length > 0) {
      const eventsList = selectedDateEvents.map(event => event.calendarItemName);
      this.showDateEventsToast(selectedDate, eventsList);
    } else {
      this.showDateEventsToast(selectedDate, []);
    }
  }

  // Function to display the toast with the heading and summary of events for the selected date
  showDateEventsToast(selectedDate: Date, eventsList: string[]): void {
    const heading = `Events information`;
    const summary = eventsList.length > 0 ? eventsList.join(', ') : 'No events for this date.';
  

    const toastConfig: IToast = {
      detail: heading,
      summary : summary,
      duration: 5000
    };

    this.toast.info(toastConfig);
  }

  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

}

