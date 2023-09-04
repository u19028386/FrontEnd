import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
// import { DataService } from '../timesheetet/data.service';

import { FormBuilder } from '@angular/forms';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as XLSX from 'xlsx';
import { DataService } from '../timesheetet/data.Service';


@Component({
  selector: 'app-time-sheet-approval',
  templateUrl: './time-sheet-approval.component.html',
  styleUrls: ['./time-sheet-approval.component.css']
})
export class TimeSheetApprovalComponent implements AfterViewInit {


months: string[] = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dtOption: DataTables.Settings={};
  currentMonth: string ='';
  timesheets: any;
  ShowTimesheet : boolean = false;
  isScheduleVisible: boolean= true;
  SelectedEmployee: any;
  EmployeeProjectReportHours: any;
  confirmationDialog: boolean = false;
  tsId: number =0;
  tsStatus: number =0;
  router: any;


  constructor(private ds: DataService, private fb: FormBuilder ) {
  }




 
  onConfirmationCancel()
  {
    this.confirmationDialog  = false;
    this.ShowTimesheet = false;
  }
  refreshPage() {
    location.reload();
  }

  onConfirm()
  {
    console.log(this.tsStatus)
    console.log(this.tsId);
    this.ds.PostAccptOrReject(this.tsId,this.tsStatus).subscribe(
      () => {
        // Success: Handle the success response
        alert('Timesheet status successfully.');
        this.refreshPage();
      },
      (error) => {
        // Error: Handle the error response
        alert('Error updating timesheet:');
      });
      this.onConfirmationCancel()
      this.refreshList();
      this.router.navigate(['']);
  }


  refreshList() {
    this.fetchData(); // Call the function to refresh the list
  }
  onApproveOrReject(tsId: number, tsStatus: number)
  {
   
    this.tsId = tsId;
    this.tsStatus = tsStatus;
    this.confirmationDialog  = true;
  }

  
 


    showEmployeeTimeSheet(monthNum: any,EmpId: any)
    {


      this.ShowTimesheet = true;
      console.log("Month Num: ",monthNum)
      console.log("Emp Num: ",EmpId)


      this.currentMonth = this.months[parseInt(monthNum)-1];


      this.ds.GetEmployeeProjecReport(EmpId, (parseInt(monthNum)-1)).subscribe((result) => {
        console.log(result);
       
        this.EmployeeProjectReportHours = result;
        this.ShowTimesheet = true;




        this.ds.getEmployee(parseInt(EmpId)).subscribe((result)=>{


          this.SelectedEmployee = result;
          console.log(result);
        });


      });
    }
    submitTimeMonthlyTimesheet() {
    throw new Error('Method not implemented.');
    }
  getStartDate(month: number = 1): string {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date(currentYear, month - 1, 1); // Subtract 1 from month (0-based)
    console.log(currentDate);
    return currentDate.toISOString();
  }
 
  fetchData()
  {
    this.ds.getALlTimesheet().subscribe(result => {
      this.timesheets = result;
     console.log(this.timesheets);
    });
  }


  ngAfterViewInit(): void {
       
        this.dtOption={
          pagingType:"full_numbers"
        }
      this.fetchData();
  }

  generateExcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, "EmployeeHours.xlsx");
}
  fileName(wb: XLSX.WorkBook, fileName: any) {
    throw new Error('Method not implemented.');
  }
public convetToPDF()
{
  var data = document.getElementById('excel-table');
  if(data!=null)
  {
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    var imgWidth = 208;
    var pageHeight = 295;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;
   
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('new-file.pdf'); // Generated PDF
    });
 }
}
 
 
}






