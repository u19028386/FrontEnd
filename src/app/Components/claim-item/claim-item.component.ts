import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClaimItem } from 'src/app/shared/claimItem';
import { ClaimType } from 'src/app/shared/claimType';
import { ClaimServiceService } from 'src/app/services/claim-service.service';

@Component({
  selector: 'app-claim-item',
  templateUrl: './claim-item.component.html',
  styleUrls: ['./claim-item.component.css']
})
export class ClaimItemComponent implements OnInit {


  claimItems: ClaimItem[] = [];
  claimTypeNames: Map<number, string> = new Map<number, string>();
  searchText: string = '';
  searchMessage!: string;
  originalClaimItems: ClaimItem[] = [];


  constructor(
    private claimService: ClaimServiceService,
    
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService
  ) { }


  ngOnInit(): void {
    this.loadClaimItems();
  }


  loadClaimItems(): void {
    this.claimService.getAllClaimItems().subscribe(
      (claimItems: ClaimItem[]) => {
        this.originalClaimItems = claimItems; 
        this.claimItems = claimItems;
        this.loadClaimTypeNames();
      },
      error => {
        console.error('Error loading claim items:', error);
      }
    );
  }


  loadClaimTypeNames(): void {
    this.claimItems.forEach(claimItem => {
      if (claimItem.claimTypeId !== null) {
        this.claimService.getClaimType(claimItem.claimTypeId!).subscribe(
          (claimType: ClaimType) => {
            if (!this.claimTypeNames.has(claimItem.claimTypeId!)) {
              this.claimTypeNames.set(claimItem.claimTypeId!, claimType.claimTypeName);
            }
          },
          error => {
            console.error('Error loading claim type name:', error);
          }
        );
      }
    });
  }


  deleteClaimItem(claimItemId: number): void {
    const confirmationMessage = 'Are you sure you want to delete this claim item?';


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
        this.claimService.deleteClaimItem(claimItemId).subscribe(
          () => {
            this.toast.success({
              detail: 'Claim item deleted successfully.',
              summary: 'Success Message',
              duration: 15000,
            });


            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
          error => {
            this.toast.error({
              detail: 'Error deleting claim item.',
              summary: 'Deletion unsuccessful!',
              duration: 5000,
            });
          }
        );
      }
    });
  }


  editClaimItem(claimItemId: number): void {
    localStorage.setItem('claimItemId', claimItemId.toString());
    this.router.navigate(['/edit-claimitem']);
    console.log(this.claimItems)
  }






  onSearch(): void {
    const searchText = this.searchText.toLowerCase().trim();
   
    if (!searchText) {
      this.claimItems = this.originalClaimItems; 
      this.toast.error({detail:'Search Error',summary:'Please enter a search criterion.',  duration: 5000 });
    } else {
      this.claimItems = this.originalClaimItems.filter(claimItem =>
        claimItem.claimItemName.toLowerCase().includes(searchText) ||
        (claimItem.claimTypeId !== null && this.getClaimTypeName(claimItem.claimTypeId)?.toLowerCase().includes(searchText))
      );
   
      
      if (this.claimItems.length === 0) {
      
      } else {
        this.searchMessage = ''; 
      }
    }
  }
 
  getClaimTypeName(claimTypeId: number): string | undefined {
    return this.claimTypeNames.get(claimTypeId);
  }
}



