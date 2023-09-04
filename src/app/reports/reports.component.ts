import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Client } from '../shared/client';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { saveAs } from 'file-saver';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Projectview } from '../shared/projectview';
import { Employee } from '../shared/employee';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
  })
  export class ReportsComponent implements OnInit {
  clients: Client[] = [];
  projects : Projectview [] = [];
  employees: Employee[] = [];
  regions: String[] = []; // Add an array to store regions
  selectedRegion: string = ''; // Selected region for filtering
  resources: String[] = [];
  selectedResource: string = '';
  filtered: Employee[] = [];
  showModal: string | null = null;
 
  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}
 
  ngOnInit(): void {
    this.getClients();
    this.getProjects();
    this.getEmployees();
  }


  getProjects() {
    this.dataService.getProjects().subscribe((result: Projectview[]) => {
      this.projects = result;
    });
  }


getClients() {
          this.dataService.getClients().subscribe((result: Client[]) => {
            this.clients = result;
          });
        }


downloadReportClient(format: string) {
            if (format === 'pdf') {
              this.downloadPdfc();
            }
          }
       
         
          private downloadPdfc() {
            const tableBody = this.clients.map(client => [
              { text: client.account, style: 'account' },
              { text: client.department, style: 'cInfo' },
              { text: client.accountManager, style: 'cInfo' },
              { text: client.siteCode, style: 'cInfo' },
              { text: client.projectCode, style: 'cInfo' }
            ]);
         
            const pdfContent = [
              { text: 'Client Report by Moyo', style: 'header' },
              { text: 'Generated on: ' + new Date().toLocaleDateString() },
              { text: 'Client List:', style: 'subheader' },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', '*', '*', '*'],
                  body: [
                    [
                      { text: 'Account', style: 'tableHeader' },
                      { text: 'Department', style: 'tableHeader' },
                      { text: 'Account Manager', style: 'tableHeader' },
                      { text: 'Site Code', style: 'tableHeader' },
                      { text: 'Project Code', style: 'tableHeader' }
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
              account: { fontSize: 12 },
              cInfo: { fontSize: 12 }
            };
         
            const pdfDefinition = {
              content: pdfContent,
              styles: pdfStyles
            };
         
            pdfMake.createPdf(pdfDefinition).download('client_report.pdf');
          }
         




          downloadReportp(format: string) {
            if (format === 'pdf') {
              this.downloadPdfp();
            }
          }


          private formatDate(date: Date): string {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
          }
 


private downloadPdfp() {
  const tableBody = this.projects.map(project => [
    { text: project.projectName, style: 'projectName' },
    { text: project.pClient, style: 'projectInfo' },
    { text: this.formatDate(new Date(project.startDate)), style: 'projectInfo' },
    { text: this.formatDate(new Date(project.endDate)), style: 'projectInfo' },
    { text: project.pStatus, style: 'projectInfo' }
  ]);


  const pdfContent = [
    { text: 'Project Report by Moyo', style: 'header' },
    { text: 'Generated on: ' + new Date().toLocaleDateString() },
    { text: 'Project List:', style: 'subheader' },
    {
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*'],
        body: [
          [
            { text: 'Project Name', style: 'tableHeader' },
            { text: 'Client', style: 'tableHeader' },
            { text: 'Start Date', style: 'tableHeader' },
            { text: 'End Date', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' }
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
    projectName: { fontSize: 12 },
    projectInfo: { fontSize: 12 }
  };


  const pdfDefinition = {
    content: pdfContent,
    styles: pdfStyles
  };


  pdfMake.createPdf(pdfDefinition).download('project_report.pdf');
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


          openModalp() {
            const modal1 = document.getElementById('project');
            if (modal1) {
              modal1.style.display = 'block';
            }
          }
       
          closeModalp() {
            const modal1 = document.getElementById('project');
            if (modal1) {
              modal1.style.display = 'none';
            }
          }


          openModale() {
            const modal2 = document.getElementById('employee');
            if (modal2) {
              modal2.style.display = 'block';
            }
          }
       
          closeModale() {
            const modal2 = document.getElementById('employee');
            if (modal2) {
              modal2.style.display = 'none';
            }
          }


         


        }



