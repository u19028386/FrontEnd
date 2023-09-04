
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProjectAllocationView } from 'src/app/shared/projectAllocationView';
import { EventReport } from 'src/app/shared/event-report';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as jsPDF from 'jspdf';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-consolidated-report',
  templateUrl: './consolidated-report.component.html',
  styleUrls: ['./consolidated-report.component.css'],
})
export class ConsolidatedProjectReportComponent implements OnInit {
  consolidatedReport: ConsolidatedReport[] = []; // Store the consolidated report data here
  projectAllocations: ProjectAllocationView[] = [];
  eventReports: EventReport[] = [];
  isModalOpen = false;


  constructor(private dataService: DataService,
              private router: Router,
              private toast: NgToastService) {} // Inject your data service


  ngOnInit(): void {
    this.getAllocations();
    this.getEvents();
   
    this.openModal();
  }


  getAllocations(){
    this.dataService.getProjectAllocations().subscribe((projectAllocations: ProjectAllocationView[]) => {
      this.projectAllocations = projectAllocations;
      this.consolidateReportForProjects(projectAllocations);
    });
  }


  getEvents(){
    this.dataService.getEventHours().subscribe((eventReports: EventReport[]) => {
      this.eventReports = eventReports;
    });
  }


  downloadReportp(format: string) {
    if (format === 'pdf') {
      this.downloadPdfp();
    }
  }


  private downloadPdfp() {
    const tableBody = this.consolidatedReport.map((allocation) => [
      { text: allocation.projectName, style: 'tableCell' },
      { text: allocation.totalNumHours.toString(), style: 'tableCell' },
      { text: allocation.totalCapturedHours.toString(), style: 'tableCell' },
      {
        text: allocation.remainingHours.toString(),
        style: allocation.remainingHours < 0 ? 'redTableCell' : 'greenTableCell',
      },
      {
        text: ((allocation.remainingHours / allocation.totalNumHours) * 100).toFixed(2) + '%',
        style: allocation.remainingHours < 0 ? 'redTableCell' : 'greenTableCell',
      },
    ]);
 
    const pdfContent = [
      { text: 'Consolidated Project Report', style: 'header' },
      { text: 'Generated on: ' + new Date().toLocaleDateString() },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              'Project Name',
              'Estimated Hours (h)',
              'Actual Hours (h)',
              'Remaining Hours (h)',
              'Remaining Hours (%)',
            ],
            ...tableBody,
          ],
        },
      },
    ];
 
    const pdfStyles = {
      header: { fontSize: 18, bold: true, marginBottom: 10 },
      tableCell: { fontSize: 12 },
      redTableCell: { fontSize: 12, fillColor: 'red' },
      greenTableCell: { fontSize: 12, fillColor: 'green' },
    };
 
    const pdfDefinition = {
      content: pdfContent,
      styles: pdfStyles,
    };
 
    pdfMake.createPdf(pdfDefinition).download('consolidated_project_report.pdf', () => {


    });
  }
 
openModal() {
this.isModalOpen = true;
}


closeModal() {
this.isModalOpen = false;
}


cancel() {
  this.router.navigate(['/project-manager']);

}


consolidateReportForProjects(projectAllocations: ProjectAllocationView[]): void {
    // Create an array to store the consolidated report
    const consolidatedReport: ConsolidatedReport[] = [];


    // Get unique project IDs from projectAllocations
    const uniqueProjectIds = [...new Set(projectAllocations.map((allocation) => allocation.projectId))];


    // Calculate the consolidated report for each project
    uniqueProjectIds.forEach((projectId) => {
      // Filter projectAllocations for the specific project
      const projectAllocationsForProject = projectAllocations.filter(
        (allocation) => allocation.projectId === projectId
      );


      // Calculate the totalNumHours for this project by summing totalNumHours from projectAllocations
      const totalNumHoursForProject = projectAllocationsForProject.reduce(
        (total, allocation) => total + allocation.totalNumHours,
        0
      );


      // Calculate the remaining hours for this project
      const remainingHours = this.calculateRemainingHoursForProject(projectId);


      // Calculate the totalCapturedHours for this project
      const totalCapturedHours = totalNumHoursForProject - remainingHours;


      // Use the projectName directly from the first allocation for this project
      const projectName = projectAllocationsForProject[0].pName;


      // Create a consolidated report object for this project
      const consolidatedProjectReport: ConsolidatedReport = {
        projectId: projectId,
        totalNumHours: totalNumHoursForProject,
        remainingHours: remainingHours,
        projectName: projectName,
        totalCapturedHours: totalCapturedHours,
      };


      consolidatedReport.push(consolidatedProjectReport);
    });


    // Assign the consolidated report to the component property
    this.consolidatedReport = consolidatedReport;
  }


  calculateRemainingHoursForProject(projectId: number): number {
    // Filter event reports for the specific project
    const projectEventReports = this.eventReports.filter((report) => Number(report.project) === projectId);


    // Calculate the total hours spent for this project
    const totalHoursSpent = projectEventReports.reduce((total, report) => {
      const startTime = new Date(report.start);
      const endTime = new Date(report.end);


      // Check if startTime and endTime are valid date objects
      if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
        const durationMilliseconds = endTime.getTime() - startTime.getTime();
        const durationHours = durationMilliseconds / (1000 * 60 * 60);
        return total + durationHours;
      } else {
        // Handle invalid date objects
        console.error('Invalid date object in event report:', report);
        return total; // Ignore this report in the calculation
      }
    }, 0);


    // Calculate the remaining hours for this project
    const totalNumHours = this.projectAllocations
      .filter((allocation) => allocation.projectId === projectId)
      .reduce((total, allocation) => total + allocation.totalNumHours, 0);


    const remainingHours = totalNumHours - totalHoursSpent;


    return remainingHours;
  }
}


// Define a custom interface for the consolidated report
interface ConsolidatedReport {
  projectId: number;
  projectName: string;
  totalNumHours: number;
  remainingHours: number;
  totalCapturedHours: number; // New attribute for total captured hours
}


