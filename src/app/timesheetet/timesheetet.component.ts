import { AfterViewInit, Component, ElementRef, EventEmitter, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { DataService } from './data.Service';
import { EmployeeReportVM, Events } from './Event';
import { DatePipe } from '@angular/common';
import { Project, ProjectAllocation, User } from './Employees';
import { FormBuilder } from '@angular/forms';
import { Observable, map } from 'rxjs';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from "jspdf";

// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-timesheetet',
  templateUrl: './timesheetet.component.html',
  styleUrls: ['./timesheetet.component.css']
})
export class TimesheetetComponent  implements AfterViewInit {
  fileName= 'ExcelSheet.xlsx';


  Submittable: boolean  = false;
  showprojectHours: boolean = false;
  EmployeeProjectHours: any;
  SelectedEmployee : any;
  dtOption: DataTables.Settings={};
  EmployeeProjectReportHours: EmployeeReportVM[] = []; // Initialize as an empty array
  currentMonth: string ="";
  updateEvent() {
      console.log(this.eventId);
    // Combine date and time into datetime using DayPilot.Date.toString()
    const startDateTime = new Date(this.date + " " + this.startTime);
    const endDateTime = new Date(this.date + " " + this.endTime);


    // Add 2 hours to the startDateTime
    startDateTime.setHours(startDateTime.getHours() + 2);
    // Add 2 hours to the endDateTime
    endDateTime.setHours(endDateTime.getHours() + 2);
    if(this.selectedProject!=null)
    {
      console.log(this.selectedProject);
      console.log(this.selectedProject);
      const newEvent = new Events( this.employee ,this.selectedProject.toString(), this.title+" "+this.comments, startDateTime.toString(), endDateTime.toString(), "#6aa84f");
      newEvent.id = this.eventId;
      this.ds.updateEvent(this.eventId,newEvent).subscribe((result) => {
      // The result contains the newly added event data returned by the API
      // console.log(result);
      // Update the timesheet with the new event
      this.monthSelectedChanged();


        // Hide the create event popup
        this.isPopupVisible = false;
        this.resetTextboxes();
      });
    }
}
 
  isPopupVisible: boolean = false;
  eventId: number = 0;
  ConfirmSubmit: boolean = false;
  isScheduleVisible: boolean= true;
  date: string = ''; // Add this property to store the selected date
  emp!: User;
  selectedMonth: number = 1;
  projects: Project[] = [];
  selectedProject: any; // If you want to store the selected project
  action: string = "";
showCreateEventPopup() {
  this.isPopupVisible = true;
}




showProjectReportHours() {
 
  this.EmployeeProjectReportHours = [];
  console.log("EmployeeId: " +this.employee);
 
 
 
  this.Submittable = false;
  this.currentMonth = this.months[parseInt(this.month)];




  console.log("IS SUBMITTABLE")
 
  this.ds.isTbmittable(this.employee, parseInt(this.month)).subscribe((result)=>{
    console.log(result);
    this.Submittable = result;
    console.log("is submittable---->",result);
  });




  console.log(this.currentMonth);


  this.ds.getEmployee(this.employee).subscribe((result) => {
    console.log(result);
    this.SelectedEmployee = result;
  });


  console.log("All ",this.employees);


    this.ds.GetEmployeeProjecReport(this.employee, parseInt(this.month)).subscribe((result) => {
    console.log(result);
   
    this.EmployeeProjectReportHours = this.EmployeeProjectReportHours.concat(result);
    console.log( "TO be reported----->", this.EmployeeProjectReportHours);
  });

 
}


generateExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
}

refreshPage() {
  location.reload();
}

public convetToPDF()
{


  const pdf = new jsPDF();
  const headers = ['Project Name', 'Hours', 'Start Time','End Time'];
  this.extractTableData();
  const startY = 20; // Starting y-coordinate for the table
  const columnWidth = 40; // Width of each column
  pdf.setFontSize(11);
      const rowHeight = 10; // Height of each row
      pdf.text("Full Name :" +this.SelectedEmployee.firstName+" "+this.SelectedEmployee.lastName, 10, 10);
      pdf.text("Email :"+ this.SelectedEmployee.emailAddress, 10, 20);




    // Draw table headers
    for (let i = 0; i < headers.length; i++) {
      pdf.text(headers[i], 10 + i * columnWidth, startY + rowHeight);
    }


    // Draw table data
    for (let i = 0; i < this.extractedData.length; i++) {
      const rowData = this.extractedData[i];
      for (let j = 0; j < rowData.length; j++) {
        pdf.text(rowData[j], 10 + j * columnWidth, startY + (i + 2) * rowHeight);
      }
    }


   
    pdf.save('table-data.pdf');
 
}




extractedData: any[][] = [];


extractTableData() {
  const tableElement = document.getElementById('excel-table');
  if(tableElement!=null)
  {
    const rows = tableElement.querySelectorAll('tbody tr');


    this.extractedData = [];


    rows.forEach(row => {
      const rowData: any[] = [];
      const columns = row.querySelectorAll('td');
     
      columns.forEach(column => {
        rowData.push(column.textContent);
      });


      this.extractedData.push(rowData);
    });


    console.log(this.extractedData); // Display the extracted data
  }
}






GenerateTSReport()
{
  const pdf = new jsPDF();


    const options = {
      scale: 2 // Increase this value for better resolution
    };


    const content = document.getElementById('pdf-content');


    if (content) { // Ensure the element is not null
      html2canvas(content, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');


        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);


        pdf.save('timesheet.pdf');
      });
    } else {
      console.error("Element with ID 'pdf-content' not found.");
    }
 
}






showProjectHours(projectId:number) {
  this.showprojectHours = true;
  console.log("ProjectId: "+projectId);
  console.log("EmployeeId: " +this.employee);
  console.log("Ping!!!!");
  this.ds.GetEmployeeProjectAllocationHours(this.employee,this.selectedProject).subscribe((result) => {
    this.EmployeeProjectHours = result;


    console.log("----->", result);
    console.log("----->",this.EmployeeProjectHours);


  });
}
SelectedshowProjectHours()
{
  console.log("-zzzz-------> this project is:", this.selectedProject);
  this.showProjectHours(this.selectedProject);
}


showConfirmationDialog()
{
  this.ConfirmSubmit = true;
  this.showProjectReportHours();
}


onConfirmationCancel()
{
  this.ConfirmSubmit = false;
  this.showprojectHours = false;
}


  @ViewChild(DayPilotSchedulerComponent, { static: false })
  timesheet!: DayPilotSchedulerComponent;
  // Properties for the input fields
  clients: string[] = ['Client 1', 'Client 2', 'Client 3'];
  title: string = '';
  comments: string = '';
  startTime: string = '';
  endTime: string = '';
  recurring: boolean = false;
  recurringWeeks: number = 1;
  days: { name: string, value: boolean }[] = [
    { name: 'Monday', value: false },
    { name: 'Tuesday', value: false },
    { name: 'Wednesday', value: false },
    { name: 'Thursday', value: false },
    { name: 'Friday', value: false },
  ];
  employees: any[] = [];
  month : string ="0";
  employee: any;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  config: DayPilot.SchedulerConfig = {
   
    rowHeaderColumns: [
      {text: "Date"},
      {text: "Day", width: 50},
      {text: "Total", width: 40},
    ],
    timeHeaders: [
      {groupBy: "Hour"},
      {groupBy: "Cell", format: "mm"}
    ],
    scale: "CellDuration",
    cellDuration: 15,
    startDate: this.getStartDate(this.month),
    days: 31,
    viewType: "Days",
    showNonBusiness: true,
    businessWeekends: false,
    allowEventOverlap: false,
    onTimeRangeSelected: async (args) => {
        this.resetTextboxes();
        this.startTime = args.start.toString("HH:mm");
        this.endTime = args.end.toString("HH:mm");
        this.date = new DayPilot.Date(args.start).toString("yyyy-MM-dd");      
        this.action = "Create";  
       
       
        this.showCreateEventPopup();
    },
   
   
    onEventMoved: (args) => {


      const eventId = args.e.data.id; // Assuming the event has an 'id' property
      const updatedEvent = {
        start: args.newStart.toString(), // Convert to string to match the format expected by the API
        end: args.newEnd.toString(),
      };
      // Get the current event data from the data service
    this.ds.getEventById(eventId).subscribe(
      (currentEvent: Events) => {
        // Update the current event object with the updated start and end properties
        currentEvent.start = new Date(updatedEvent.start);
        currentEvent.end = new Date(updatedEvent.end);


        // Add 2 hours to the startDateTime
        currentEvent.start.setHours(currentEvent.start.getHours() + 2);
        // Add 2 hours to the endDateTime
        currentEvent.end.setHours(currentEvent.end.getHours() + 2);


        // Call the updateEvent method to update the event on the server
        this.ds.updateEvent(eventId, currentEvent).subscribe(
          (result) => {
            // The event has been successfully updated on the server
            args.control.message("Timecard Moved: " + args.e.text());
          },
          (error) => {
            console.error("Error moving event:", error);
          }
        );
      },
      (error) => {
        console.error("Error retrieving event data:", error);
      }
    );
    },
    onEventResized: (args) => {
      const eventId = args.e.data.id; // Assuming the event has an 'id' property
      const updatedEvent = {
        start: args.newStart.toString(), // Convert to string to match the format expected by the API
        end: args.newEnd.toString(),
      };
      // Get the current event data from the data service
    this.ds.getEventById(eventId).subscribe(
      (currentEvent: Events) => {


       
        console.log("Before: ", currentEvent);
        // Update the current event object with the updated start and end properties
        currentEvent.start = new Date(updatedEvent.start);
        currentEvent.end = new Date(updatedEvent.end);
        // Add 2 hours to the startDateTime
        currentEvent.start.setHours(currentEvent.start.getHours() + 2);
        // Add 2 hours to the endDateTime
        currentEvent.end.setHours(currentEvent.end.getHours() + 2);


        console.log("After: ", currentEvent);


        // Call the updateEvent method to update the event on the server
        this.ds.updateEvent(eventId, currentEvent).subscribe(
          (result) => {
            // The event has been successfully updated on the server
            //console.log(result);
            args.control.message("Timecard resized: " + args.e.text());
          },
          (error) => {
            console.error("Error updating event:", error);
          }
        );
      },
      (error) => {
        console.error("Error retrieving event data:", error);
      }
    );
     
    },
    eventDeleteHandling: "Update",
    onEventDeleted: (args) => {
      const eventId = args.e.data.id; // Assuming the event has an 'id' property


      this.ds.getEventById(eventId).subscribe(
        (currentEvent: Events) => {
         
          // Call the updateEvent method to update the event on the server
          this.ds.deleteEvent(eventId).subscribe(
            (result) => {
              // The event has been successfully updated on the server
              args.control.message("Timecard deleted: " + args.e.text());
            },
            (error) => {
              console.error("Error deleting event:", error);
            }
          );
        })
         
    },
    onEventClick: (args) => {
     
      this.action = "Update";
      const eventId = args.e.data.id; // Assuming the event has an 'id' property
      this.eventId = eventId;
      console.log(eventId);
     
      this.title = "";
      this.comments = "";
      this.startTime ="";        
      this.endTime = "";
      this.ds.getEventById(eventId).subscribe(
        (result) => {
          this.selectedProject = result.project;
          if(result.project!=null){
            const project =  this.projects.find(project => project.projectId === parseInt(result.project)) ;
     
            if (project) {
              this.selectedProject = project.projectId;
              console.log("You Selected------->",this.selectedProject);
              console.log("Your current Project---->",project)


              this.selectedProject = project ;


              return this.selectedProject;
             
            } else {
              console.error(`Project with ID ${result.project} not found.`);
              return  this.selectedProject;
 
            }
         }
         return  this.selectedProject;
 
        },
        (error) => {
         // console.error('Error retrieving event:', error);
          return  this.selectedProject;
 
        }
      );






      this.ds.getEventById(eventId).subscribe((result) => {
        const project = this.selectProject(eventId);
        console.log(result);
        console.log(this.selectProject(eventId));
        if (project != null) {
          this.selectedProject = project;


            //console.log(result);
            //console.log( this.selectedProject);
            const startDateTime = new Date(result.start);
            const startHours = startDateTime.getHours();
            const startMinutes = startDateTime.getMinutes();


            this.startTime = `${startHours}:${startMinutes.toString().padStart(2, '0')}`;
           
            const endDateTime = new Date(result.end);
            const endHours = endDateTime.getHours();
            const endMinutes = endDateTime.getMinutes();


            this.endTime = `${endHours}:${endMinutes.toString().padStart(2, '0')}`;


            this.selectedProject = project.projectId;
            this.title = project.projectName;
            this.comments = project.projectName;
            this.startTime = this.startTime;        
            this.endTime = this.endTime;
         
          this.showCreateEventPopup();
        }
        });


      this.showCreateEventPopup();
      // Do nothing when an event is clicked
    },
   
    onBeforeRowHeaderRender: args => {
      const day = args.row.start.toString("ddd");
      args.row.columns[1].text = `${day}`;


      const duration = args.row.events.totalDuration();
      if (duration.totalSeconds() === 0) {
        return;
      }


      let hours = duration.toString('H:mm');
      if (duration.totalDays() >= 1) {
        hours = Math.floor(duration.totalHours()) + ':' + duration.toString('mm');
      }
      args.row.columns[2].text = `${hours}`;


      const max = DayPilot.Duration.ofHours(8);
      const pct = args.row.events.totalDuration().totalSeconds() / max.totalSeconds();
      args.row.columns[2].areas = [
        {
          bottom: 0,
          left: 0,
          width: 40,
          height: 4,
          backColor: "#ffe599",
        },
        {
          bottom: 0,
          left: 0,
          width: 40 * pct,
          height: 4,
          backColor: "#f1c232",
        }
      ];
    },
    onBeforeEventRender: args => {
   
    }
  };


  constructor(private ds: DataService, private fb: FormBuilder) {
  }


  @Output() createEvent = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();


  createNewEvent() {




    // Combine date and time into datetime using DayPilot.Date.toString()
    const startDateTime = new Date(this.date + " " + this.startTime);
    const endDateTime = new Date(this.date + " " + this.endTime);


    // Add 2 hours to the startDateTime
    startDateTime.setHours(startDateTime.getHours() + 2);
    // Add 2 hours to the endDateTime
    endDateTime.setHours(endDateTime.getHours() + 2);
    if(this.selectedProject!=null)
    {
      console.log(this.selectedProject);
      console.log(this.selectedProject);
      const newEvent = new Events( this.employee ,this.selectedProject.toString(), this.title+" "+this.comments, startDateTime.toString(), endDateTime.toString(), "#6aa84f");
   
      this.ds.addEvent(newEvent).subscribe((result) => {
      // The result contains the newly added event data returned by the API
      // console.log(result);
      // Update the timesheet with the new event
      this.monthSelectedChanged();


        // Hide the create event popup
        this.isPopupVisible = false;
        this.showprojectHours = false;
        this.onCancel();
        this.resetTextboxes();
        this.timesheet.control.message("Successfully Added Time Card");
        this.monthSelectedChanged();
      });
    }
  }


  onCancel() {


    this.cancel.emit();
    this.resetTextboxes();
    this.isPopupVisible = false;
    this.showprojectHours = false;
  }
  monthSelected(selectedMonth: number) {
    this.month = selectedMonth.toString();
    console.log('Selected Month:', selectedMonth);


    // Update the timesheet when the month is changed
    console.log("toAutomatically change months ->", selectedMonth);
    this.config.startDate = this.getStartDate(this.month);
    this.timesheet.control.update({ startDate: this.config.startDate });
     this.timesheet.control.update({ startDate: this.config.startDate });
  }
  getStartDate(month: string): string {
    const monthNumber = Number(month)+1;
    const year = new Date().getFullYear(); // Get the current year
    return `${year}-${monthNumber < 10 ? '0' : ''}${monthNumber}-01`;
  }


  loadProjects(): void {
    this.ds.GetEmployeeProjects(this.employee).subscribe(
      (projects: Project[]) => {
        this.projects = projects;
        console.log("Proj----->", this.projects)
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }
 


  selectProject(id: number): any {
   
   
 
    return  this.selectedProject;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['month'] && !changes['month'].firstChange) {
      this.config.startDate = this.getStartDate(this.month);
      this.timesheet.control.update({ startDate: this.config.startDate });
    }
  }
  resetTextboxes() {
    this.title = '';
    this.comments = '';
    this.startTime = '';
    this.endTime = '';
    this.selectedProject = 0;
  }
  monthSelectedChanged()
  {
    const year = new Date().getFullYear(); // Get the current year
    const monthNumber = this.selectedMonth; // Use the selected month index directly
    const firstDayOfMonth = new Date(year, monthNumber, 1);
    const lastDayOfMonth = new Date(firstDayOfMonth); // Make a copy
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);


    const from = new DayPilot.Date(firstDayOfMonth);
    const to = new DayPilot.Date(lastDayOfMonth);


    let number = parseInt(this.selectedMonth.toString(), 10) ;
   
    this.month = number.toString();
    console.log("GetStartdate method--->",this.getStartDate(this.month));


    this.timesheet.control.update({ startDate: this.getStartDate(this.month)});


    // Call the DataService to get the events for the selected month
    this.ds.getEvents(from, to, this.employee).subscribe(events => {
      this.timesheet.control.update({ events });
      console.log("-------")
      console.log(events);
    });
  }
  submitTimeMonthlyTimesheet()
  {
    console.log("Ping");
    console.log(this.employee);
    console.log(this.month);


    this.ds.submitTimesheetEvent(parseInt(this.employee), (parseInt(this.month)+1)).subscribe(
      () => {
        // Success: Handle the success response
        console.log('Timesheet submitted successfully.');
        this.timesheet.control.message("Timesheet submitted successfully."); // Display success message
         this.refreshPage();
      },
      (error) => {
        // Error: Handle the error response
        console.error('Error submitting timesheet:', error);
        this.timesheet.control.message("Timesheet failed to submit"); // Display error message
      }


    );    
   


    // Calculate the 'from' and 'to' dates for the selected month
    const year = new Date().getFullYear(); // Get the current year
    const monthNumber = this.selectedMonth; // Use the selected month index directly
    const firstDayOfMonth = new Date(year, monthNumber, 1);
    const lastDayOfMonth = new Date(firstDayOfMonth); // Make a copy
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);


    const from = new DayPilot.Date(firstDayOfMonth);
    const to = new DayPilot.Date(lastDayOfMonth);
 
    // Call the DataService to get the events for the selected month
    this.ds.getEvents(from, to, this.employee).subscribe(events => {
      this.timesheet.control.update({ events });
      console.log("-------")
      console.log(events);
    });
 




    this.onConfirmationCancel();
  }
  monthTimeSelected(selectedMonth: number) {
    // Calculate the 'from' and 'to' dates for the selected month
    const year = new Date().getFullYear(); // Get the current year
    const monthNumber = selectedMonth + 1; // Increment month by 1 since getStartDate expects 1-based months
    const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
    const lastDayOfMonth = new Date(year, monthNumber, 0);
    const from = new DayPilot.Date(firstDayOfMonth);
    const to = new DayPilot.Date(lastDayOfMonth);


    // Update the timesheet when the month is changed
    this.config.startDate = this.getStartDate(selectedMonth.toString());
    this.timesheet.control.update({ startDate: this.config.startDate });


    // Call the DataService to get the events for the selected month
    this.ds.getEvents(from, to, this.employee).subscribe(events => {
      console.log("zzzz"+events);


      this.timesheet.control.update({ events });
    });
  }
  employeeSelected($event: Event) {
    const from = this.timesheet.control.visibleStart();
    const to = this.timesheet.control.visibleEnd();
    this.ds.getEvents(from, to, this.employee).subscribe(events => {
      console.log(this.employee);
      console.log("My-------->", events);

      this.timesheet.control.update({events});
    });
    this.loadProjects();
  }


  ngAfterViewInit(): void {


    this.dtOption={
      pagingType:"full_numbers"
    }
    const currentDate = new Date();
    this.month = currentDate.getMonth().toString();
    this.config.startDate = this.getStartDate(this.month);
    this.timesheet.control.update({ startDate: this.config.startDate });


    const firstDay = this.timesheet.control.visibleStart().getDatePart();
    const businessStart = this.timesheet.control.businessBeginsHour || 9;
    const scrollToTarget = firstDay.addHours(businessStart);
    this.timesheet.control.scrollTo(scrollToTarget);




    // @ts-ignore
    window["dp"] = this.timesheet.control;


    this.ds.getEmployees().subscribe(employees => {
      this.employees = employees;
     //console.log(employees);
     console.log( this.employees);
     
    });


    this.selectedMonth = currentDate.getMonth(); // Set selectedMonth to the current month (0 to 11)
    this.monthSelectedChanged();
    console.log("Selected Month----->",this.selectedMonth);
 
  }


}




