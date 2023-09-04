import { Component, OnInit } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { Help } from 'src/app/shared/help';
import { HelpType } from 'src/app/shared/helpType';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { Router } from '@angular/router';
import { Observable, catchError, combineLatest, map, of } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-help',
  templateUrl: './g-help.component.html',
  styleUrls: ['./g-help.component.css'],
})
export class GHelpComponent implements OnInit {
  helps: Help[] = [];
  helpTypes: HelpType[] = [];
  searchQuery: string = '';
  filteredHelps: Help[] = []; // Array to hold filtered helps


  constructor(
    private helpService: HelpService,
    private helpTypeService: HelpTypeService,
    private router: Router,
    private toast: NgToastService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
    // Fetch both helps and help types using combineLatest
    combineLatest([this.getHelps(), this.getHelpTypes()]).subscribe(([helps, helpTypes]) => {
      this.helps = helps.map(help => ({
        ...help,
        helpTypeName: this.getHelpTypeName(help.helpTypeId, helpTypes),
      }));
      this.filteredHelps = this.helps; // Initialize filteredHelps array
    });
  }
 
  getHelps(): Observable<Help[]> {
    return this.helpService.GetAllHelp();
  }


  getHelpTypes(): Observable<HelpType[]> {
    return this.helpTypeService.GetAllHelpType().pipe(catchError(() => of([])));
  }


  getHelpTypeName(helpTypeId: number, helpTypes: HelpType[]): string {
    const foundType = helpTypes.find(type => type.helpTypeId === helpTypeId);
    return foundType ? foundType.helpTypeName : 'Unknown';
  }


  downloadHelp(help: Help): void {
    // Implement the functionality to download the help here
    this.helpService.DownloadHelp(help.helpId).subscribe((data: any) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = help.fileName || 'helpfile.bin';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }


  editHelp(help: Help): void {
    this.router.navigate(['/help/edit', help.helpId]);
    console.log('helpview', help);
  }
 


  deleteHelp(helpId: number): void {
    const confirmationMessage = 'Are you sure you want to delete this help?';


    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: confirmationMessage,
      },
     
      width: '350px',
      height: '200px',
      position: {
        top: '0px',
        left: '600px',}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helpService.DeleteHelp(helpId).subscribe(
          () => {
            this.toast.success({
              detail: 'Success Message',
              summary: 'Help deleted successfully.',
              duration: 15000,
            });


            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error => {
            this.toast.error({
              detail: 'Deletion unsuccessful!',
              summary: 'Error deleting help.',
              duration: 5000,
            });
          }
        );
      }
    });
  }


  searchHelps(): void {
    const lowerCaseQuery = this.searchQuery.trim().toLowerCase();


    if (lowerCaseQuery === '') {
      // Display error toast when search query is empty
      this.toast.error({
        detail: 'Please provide a search criterion.',
        summary: 'Search Error',
        duration: 5000,
      });


      // Reset the filteredHelps array to the original data
      this.filteredHelps = this.helps;
    } else {
      // Filter helps based on the query
      this.filteredHelps = this.helps.filter(
        help => help.helpName.toLowerCase().includes(lowerCaseQuery) ||
                help.helpDescription.toLowerCase().includes(lowerCaseQuery)
      );
    }
  }
}
