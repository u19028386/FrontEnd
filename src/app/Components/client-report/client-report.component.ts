
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css']
})
export class ClientReportComponent {
  @ViewChild('downloadLink', { static: false }) downloadLinkRef!: ElementRef;
  clients: Client[] = [];
  showModal: string | null = null;
  isModalOpen = false;
 
  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}
 
  ngOnInit(): void {
    this.getClients();
    this.openModal();
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
              header: { fontSize: 14, bold: true, marginBottom: 10 },
              subheader: { fontSize: 12, bold: true, marginTop: 10 },
              tableHeader: { fontSize: 10, bold: true, fillColor: '#f2f2f2' },
              account: { fontSize: 8 },
              cInfo: { fontSize: 8 }
            };
         
            const pdfDefinition = {
              content: pdfContent,
              styles: pdfStyles
            };
         
            pdfMake.createPdf(pdfDefinition).download('client_report.pdf');
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


          base64ToBlob(base64: string, contentType: string): Blob {
            const byteCharacters = atob(base64);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            return new Blob(byteArrays, { type: contentType });
          }
       
          downloadTableDataAsExcel() {
            const table = document.getElementById('client');
           
            if (!table) {
              return;
            }
         
            const tableData = this.extractTableData(table);
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
         
           
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'TableData');
         
            // Protect the worksheet to make it read-only
            ws['!protect'] = {
              selectLockedCells: true,
              selectUnlockedCells: true,
              password: 'your_password_here',
            };
         
            const excelBase64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
         
            const blob = this.base64ToBlob(excelBase64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
         
            const url = window.URL.createObjectURL(blob);
         
            // Set the blob URL as the href of the hidden 'a' element
            this.downloadLinkRef.nativeElement.href = url;
            this.downloadLinkRef.nativeElement.download = 'client_protected.xlsx';
         
            this.downloadLinkRef.nativeElement.click();
         
            window.URL.revokeObjectURL(url);
          }
         
        extractTableData(table: HTMLElement): any[] {
          const tableData = [];
          const rows = table.getElementsByTagName('tr');
          const headerCells = rows[0].querySelectorAll('th');
       
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowData: { [key: string]: string } = {};
       
            for (let j = 0; j < headerCells.length; j++) {
              const cell = row.cells[j];
              const header = headerCells[j].textContent || `Column${j + 1}`;
              rowData[header] = cell.textContent || '';
            }
       
            tableData.push(rowData);
          }
       
          return tableData;
        }
       
        }


