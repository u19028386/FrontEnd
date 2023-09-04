
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Employee } from 'src/app/shared/employee';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent {
  employees: Employee[] = [];
  regions: String[] = []; // Add an array to store regions
  selectedRegion: string = ''; // Selected region for filtering
  resources: String[] = [];
  selectedResource: string = '';
  filtered: Employee[] = [];
  showModal: string | null = null;
  isModalOpen = false;
 
  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}
 
  ngOnInit(): void {
    this.getEmployees();
    this.openModal();
  }


          getEmployees() {
            this.dataService.getEmployees().subscribe((result: Employee[]) => {
              this.employees = result;
              this.filtered = result;
              this.regions = Array.from(new Set(result.map(employee => employee.pRegion)));
              this.resources = Array.from(new Set(result.map(employee => employee.pResource)));
            });
          }
       
          applyFilters() {
            this.filterByRegion();
            this.filterByResource();
          }


       
          filterByResource() {
            if (this.selectedResource) {
              this.filtered = this.filtered.filter(employee => employee.pResource === this.selectedResource);
            }
            else {
              this.filtered = this.employees;
            }
          }
       
          filterByRegion() {
            if (this.selectedRegion) {
              this.filtered = this.employees.filter(employee => employee.pRegion === this.selectedRegion);
            } else {
              this.filtered = this.employees;
            }
          }
         
          clearFilter() {
            this.selectedRegion = '';
            this.selectedResource = '';
            this.filtered = this.employees;
          }


          downloadReport(format: string) {
            if (format === 'pdf') {
              this.downloadFilteredPdf();
            }
          }
         
       


downloadFilteredPdf() {
  const tableBody = this.filtered.map(employee => [
 
    { text: employee.pLastName, style: 'pInfo' },
    { text: employee.pFirstName, style: 'pInfo' },
    { text:  employee.pResource, style: 'pInfo' },
    { text: employee.pStatus, style: 'pInfo' },
    { text:  employee.pType, style: 'pInfo' },
    { text: employee.pRegion, style: 'pInfo' },
    { text: employee.pDivision, style: 'pInfo' }
  ]);


  const pdfContent = [
    { text: 'Filtered Employee Report by Moyo', style: 'header' },
    { text: 'Generated on: ' + new Date().toLocaleDateString() },
    { text: 'Employee List:', style: 'subheader' },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
        body: [
          [
            // { text: 'Employee ID', style: 'tableHeader' },
            { text: 'Last Name', style: 'tableHeader' },
            { text: 'First Name', style: 'tableHeader' },
            { text: 'Resource', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
            { text: 'Type', style: 'tableHeader' },
            { text: 'Region', style: 'tableHeader' },
            { text: 'Division', style: 'tableHeader' }
          ],
          ...tableBody
        ]
      }
    }
  ];


  const pdfStyles = {
    header: { fontSize: 18, bold: true, marginBottom: 10 },
    subheader: { fontSize: 16, bold: true, marginTop: 10 },
    tableHeader: { fontSize: 14, bold: true, fillColor: '#f2f2f2' },
    pInfo: { fontSize: 12 }
  };


  const pdfDefinition = {
    content: pdfContent,
    styles: pdfStyles
  };


  pdfMake.createPdf(pdfDefinition).download('filtered_employee_report.pdf');
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

}
