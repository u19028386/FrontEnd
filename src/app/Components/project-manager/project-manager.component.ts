import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { Task } from 'src/app/shared/task';
import { UserStoreService } from 'src/app/user-store.service';
import { Observable, catchError, combineLatest, map, of } from 'rxjs';
import { TaskType } from 'src/app/shared/taskType';
import { TaskPriority } from 'src/app/shared/taskProirity';
import { TaskStatus } from 'src/app/shared/taskStatus';
import { Project } from 'src/app/shared/project';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { CalendarItem } from 'src/app/shared/calendaritem';
import { CalendarDay } from 'src/app/shared/calendarDay';
import { Calendar } from 'src/app/shared/calendar';
import { DataService } from 'src/app/services/data.service';
import { IToast } from 'ng-angular-popup/lib/toast.model';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.css']
})
export class ProjectManagerComponent implements OnInit{

  public fullName: string = "";
  public showAddForm: boolean = false;
  user: any = {};
  public role!:string;
  public userId!: string;
  public employeeId!: number;
  tasks: Task[] = [];
  taskTypes: TaskType[] = [];
  taskPriorities: TaskPriority[] = [];
  taskStatuses: TaskStatus[] = [];
  projects: Project[] = [];
  searchQuery: string = '';
  public newTask: Task = {} as Task;
  allTasks: Task[] = [];
  profilePictureUrl: string = '';
  selectedTask: Task | null = null;
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

  constructor(private apiService: APIService, 
    private userStore: UserStoreService, 
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private toast: NgToastService){}

  ngOnInit() {
    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
      this.getTasks();
    });
    this.userStore.getFullName()
  .subscribe(val => {
    const fullNameFromToken = this.apiService.getNameFromToken();
    this.fullName = (val || fullNameFromToken) as string;
});

    this.userStore.getRole()
    .subscribe(val=>{
      const roleFromToken = this.apiService.getRoleFromToken();
      this.role = (val || roleFromToken) as string
    });

    this.getTasksObservable();
    this.getTasks();

    this.apiService.getAllTaskPriorities().subscribe((taskPriorities: TaskPriority[]) => {
      this.taskPriorities = taskPriorities;
      console.log(this.taskPriorities); // Check if priorities are populated
    });

    this.apiService.getAllTaskStatuses().subscribe((taskStatuses: TaskStatus[]) => {
      this.taskStatuses = taskStatuses;
      console.log(this.taskStatuses); // Check if priorities are populated
    });
    
    this.apiService.getAllTaskTypes().subscribe((taskTypes: TaskType[]) => {
      this.taskTypes = taskTypes;
      console.log(this.taskTypes); // Check if priorities are populated
    });

    this.apiService.getAllProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
      console.log(this.projects); // Check if priorities are populated
    });
    this.apiService.getProfilePictureUrl(+this.userId).subscribe(
      (response: any) => {
        // `response` will contain the profile picture data
        this.profilePictureUrl = URL.createObjectURL(response);
      },
      (error) => {
        console.log('Error fetching profile picture:', error);
      }
    );
    const today = new Date();
  this.currentMonth = today.getMonth();
  this.currentYear = today.getFullYear();
  this.generateCalendarDays(this.currentMonth, this.currentYear);
  this.getCalendarItems();
  this.fetchCalendarItems();

  this.upcomingEventsForNextDay = this.getUpcomingEventsForNextDay(today);
  this.todayEventsForNextDay = this.getTodayEventsForNextDay(today);
    this.loadTasks();
    
  }
  logOut()
  {
    this.apiService.logOut();
  }
  goToProfile(): void {
    this.router.navigate(['profile', this.userId]);
  }
  getTasks(): void {
    this.getTasksObservable().subscribe(tasks => {
      console.log('Tasks:', tasks);
      this.tasks = tasks;
    });
  }
  
  getTasksObservable(): Observable<Task[]> {
    return this.apiService.getEmployeeByUserId(this.userId).pipe(
      switchMap(employee => {
        return this.apiService.getAllTasks().pipe(
          map((tasks: Task[]) => {
            return tasks
              .filter(task => task.employeeId === employee.employeeId)
              .map(task => ({
                ...task,
                taskTypeName: this.getTaskTypeName(task.taskTypeId),
                priorityName: this.getTaskPriorityName(task.priorityId),
                taskStatusName: this.getTaskStatusName(task.taskStatusId),
                projectName: this.getProjectName(task.projectId),
              }));
          })
        );
      })
    );
  }


  // getTaskTypes(): Observable<TaskType[]> {
  //   return this.apiService.getAllTaskTypes().pipe(catchError(() => of([])));
  // }

  // getTaskStatuses(): Observable<TaskStatus[]> {
  //   return this.apiService.getAllTaskStatuses().pipe(catchError(() => of([])));
  // }
  // getTaskPriorities(): Observable<TaskPriority[]> {
  //   return this.apiService.getAllTaskPriorities().pipe(catchError(() => of([])));
  // }

  getTaskTypeName(taskTypeId: number): string {
    const foundType = this.taskTypes.find(type => type.taskTypeId === taskTypeId);
    return foundType ? foundType.taskTypeName : 'Unknown';
  }

  getTaskPriorityName(priorityId: number): string {
    const foundType = this.taskPriorities.find(type => type.priorityId === priorityId);
    return foundType ? foundType.priorityName : 'Unknown';
  }

  getTaskStatusName(taskStatusId: number): string {
    const foundType = this.taskStatuses.find(type => type.taskStatusId === taskStatusId);
    return foundType ? foundType.statusName : 'Unknown';
  }
  getProjectName(projectId: number): string {
    const foundType = this.projects.find(type => type.projectId === projectId);
    return foundType ? foundType.projectName : 'Unknown';
  }

  editTask(task: Task): void {
    // Store the help data in local storage
    localStorage.setItem('taskData', JSON.stringify(task));


    // Navigate to the edit page
    this.router.navigate(['/edit-task', task.taskId]);
  }
  deleteTask(taskId: number): void {
    this.apiService.deleteTask(taskId).subscribe(() => {
      window.location.reload();
    });
  }

  searchTasks(): void {
    console.log('Search button clicked');
    if (this.searchQuery.trim() === '') {
      // If the search query is empty, show all helps
      this.getTasksObservable().subscribe(tasks => {
        this.tasks = tasks.map(task => ({
          ...task,
          taskTypeName: this.getTaskTypeName(task.taskTypeId),
          priorityName: this.getTaskPriorityName(task.priorityId),
          taskStatusName: this.getTaskStatusName(task.taskStatusId),
          projectName: this.getProjectName(task.projectId),
        }));
      });
    } else {
      // If the search query is not empty, filter helps based on the query
      const lowerCaseQuery = this.searchQuery.trim().toLowerCase();
      this.tasks = this.tasks.filter(
        task => task.taskName.toLowerCase().includes(lowerCaseQuery) ||
                task.taskDescription.toLowerCase().includes(lowerCaseQuery)
      );
    }
  }
  loadTasks(): void {
    this.apiService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        console.log('Tasks loaded:', tasks);
        this.tasks = tasks
          .filter(task => task.employeeId === +this.userId)
          .map(task => ({
            ...task,
            taskTypeName: this.getTaskTypeName(task.taskTypeId),
            priorityName: this.getTaskPriorityName(task.priorityId),
            taskStatusName: this.getTaskStatusName(task.taskStatusId),
            projectName: this.getProjectName(task.projectId)
          }));
      },
      error => {
        console.log('Error loading tasks:', error);
      }
    );
  }
  addTask(task: Task): void {
    // Fetch employee using userId
    this.apiService.getEmployeeByUserId(this.userId).subscribe(
      (employee) => {
        // Create a new task with employeeId from the fetched employee
        const newTask: Task = {
          ...task,
          employeeId: employee.employeeId, // Use employee's employeeId
          isComplete: false,
        };
  
        // Add the task using the employeeId
        this.apiService.addTask(newTask).subscribe(() => {
          console.log("Successfully added task!");
          // Refresh task list after adding
          this.loadTasks();
          this.cdr.detectChanges();
          // Reset form fields
          this.newTask = {} as Task;
          this.showAddForm = false;
        }, error => {
          // Handle error
        });
      },
      error => {
        // Handle error fetching employee details
      }
    );
  }

  showTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
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
