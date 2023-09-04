import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpType } from 'src/app/shared/helpType';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-help-type',
  templateUrl: './help-type.component.html',
  styleUrls: ['./help-type.component.css']
})
export class HelpTypeComponent implements OnInit {
  helpTypes: HelpType[] = [];
  allHelpTypes: HelpType[] = [];
  searchText: string = '';
  helpTypeIdToDelete: number | null = null;
  searchMessage: string = '';


  constructor(private helpTypeService: HelpTypeService, private router: Router, private toast: NgToastService,  private dialog: MatDialog) { }


  ngOnInit(): void {
    this.getAllHelpType();
  }


  getAllHelpType(): void {
    this.helpTypeService.GetAllHelpType().subscribe(result => {
      this.helpTypes = result;
      this.allHelpTypes = result; // Keep a copy of all help types for filtering
    });
  }


  edithelpTypeId(helpTypeId: number): void {
    localStorage.setItem('helpTypeId', helpTypeId.toString());
    this.router.navigate(['/help-type/edit']);
  }




  deleteHelpType(helpTypeId: number): void {
    const confirmationMessage = 'Are you sure you want to delete this help type?';
 
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {


        title: 'Confirm Deletion',
        message: confirmationMessage,
      },
      width: '350px',
      height: '200px',
      position: {
        top: '0px',
        left: '600px',
    }
    });
 


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.helpTypeService.DeleteHelpType(helpTypeId).subscribe(
          () => {
            this.toast.success({
              detail: 'Success Message',
              summary:'Help type deleted successfully.' ,
              duration: 15000,
            });
 
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error => {
            this.toast.error({
              detail: 'Deletion unsuccessful!',
              summary: 'Error deleting help type.',
              duration: 5000,
            });
          }
        );
      }
    });
  }
 
  onSearch(): void {
    const searchText = this.searchText.toLowerCase().trim();
    this.helpTypes = this.allHelpTypes.filter(helpType =>
      helpType.helpTypeName?.toLowerCase().includes(searchText) ||
      helpType.helpTypeDescription?.toLowerCase().includes(searchText)
    );
 
    if (!searchText) {
      this.toast.error({ detail:'Search Error', summary:'Please provide a search criterion.',  duration: 5000 });
    // } else if (this.helpTypes.length === 0) {
    //   this.searchMessage = 'No results found.'; // Leave the other error message as is
    // } else  if{
      this.searchMessage = '';
    }
  }
}

