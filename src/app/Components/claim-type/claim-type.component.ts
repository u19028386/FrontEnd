import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ClaimServiceService } from 'src/app/services/claim-service.service';
import { ClaimType } from 'src/app/shared/claimType';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-claim-type',
  templateUrl: './claim-type.component.html',
  styleUrls: ['./claim-type.component.css']
})
export class ClaimTypeComponent {
  claimTypes: ClaimType[] = [];
  allClaimTypes: ClaimType[] = [];
  searchText: string = '';
  searchMessage!: string;


  constructor(
    private claimTypeService: ClaimServiceService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getAllClaimTypes();
  }


  getAllClaimTypes(): void {
    this.claimTypeService.getAllClaimTypes().subscribe(result => {
      this.claimTypes = result;
      this.allClaimTypes = result;
      console.log(this.claimTypes); 
    });
  }
  deleteClaimType(claimTypeId: number): void {
    const confirmationMessage = 'Are you sure you want to delete this claim type?';
 
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
        this.claimTypeService.deleteClaimType(claimTypeId).subscribe(
          () => {
            this.toast.success({
              detail: 'Success Message' ,
              summary:'Claim type deleted successfully.',
              duration: 15000,
            });
 
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error => {
            this.toast.error({
              detail: 'Deletion unsuccessful!',
              summary:'Error deleting claim type.' ,
              duration: 5000,
            });
          }
        );
      }
    });
  }
 


  editClaimType(claimTypeId: number): void {
    localStorage.setItem('claimTypeId', claimTypeId.toString());
    this.router.navigate(['/edit-claimtype']);
  }




  onSearch(): void {
    const searchText = this.searchText.toLowerCase().trim();
 
    if (!searchText) {
      this.claimTypes = this.allClaimTypes;
      this.toast.error({ detail:'Search Error', summary:'Please enter a search criterion.',  duration: 5000 });
    } else {
      this.claimTypes = this.allClaimTypes.filter(claimType =>
        claimType.claimTypeName?.toLowerCase().includes(searchText) ||
        claimType.claimTypeDescription?.toLowerCase().includes(searchText)
      );
 
 
}
}
}
