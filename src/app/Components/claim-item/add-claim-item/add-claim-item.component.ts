import { Component, OnInit } from '@angular/core';
import { ClaimItem } from 'src/app/shared/claimItem';
import { ClaimType } from 'src/app/shared/claimType';
import { ClaimServiceService } from 'src/app/services/claim-service.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-claim-item',
  templateUrl: './add-claim-item.component.html',
  styleUrls: ['./add-claim-item.component.css']
})
export class AddClaimItemComponent implements OnInit {
  newClaimItem: ClaimItem = {
    claimItemId: 0,
    claimTypeId: null,
    claimItemName: ''
  };
  claimTypes: ClaimType[] = [];
 


  constructor(
    private claimService: ClaimServiceService,
  
    private toast: NgToastService,
    private router: Router,
  ) {}


  ngOnInit(): void {
    this.loadClaimTypes();
  }


  cancel() {
    this.router.navigate(['/Claim-item']);
  }


  loadClaimTypes(): void {
    this.claimService.getAllClaimTypes().subscribe(
      (claimTypes: ClaimType[]) => {
        this.claimTypes = claimTypes;
      },
      error => {
        console.error('Error loading claim types:', error);
      }
    );
  }


  onSubmit(): void {
    const claimItemName: string = this.newClaimItem.claimItemName || '';
    const claimTypeId: number | null = this.newClaimItem.claimTypeId;
   


    if (!/^[A-Za-z\s]+$/.test(claimItemName)) {
   
      this.toast.error({ detail: 'Validation Error', summary: 'Please enter a valid claim item name with no numbers or special characters.', duration: 5000 });
      return;
    }
 
   
    if (claimTypeId === null) {
     
      this.toast.error({ detail: 'Validation Error', summary: 'Please select a claim type.', duration: 5000 });
      return;
    }
 
   
    this.claimService.getAllClaimItems().subscribe(
      (claimItems: ClaimItem[]) => {
        const existingClaimItemNames = claimItems.map(ci => ci.claimItemName.toLowerCase());
 
        if (existingClaimItemNames.includes(claimItemName.toLowerCase())) {
     
          this.toast.error({ detail: 'Validation Error', summary: 'Claim item name already exists.', duration: 5000 });
          return;
        }
 
   
        this.claimService.addClaimItem(this.newClaimItem).subscribe(
          (createdClaimItem: ClaimItem) => {
            console.log('Claim item added:', createdClaimItem);
         
            this.toast.success({ detail: 'Success', summary: 'Claim item added successfully.', duration: 5000 });
            this.router.navigate(['/Claim-item']);
           
            this.newClaimItem = {
              claimItemId: 0,
              claimTypeId: null,
              claimItemName: ''
            };
          },
          error => {
            console.error('Error adding claim item:', error);
       
            this.toast.error({ detail: 'Error', summary: 'Error adding claim item.', duration: 5000 });
          }
        );
      },
      error => {
        console.error('Error fetching claim items:', error);
      }
    );
  }
 
 
}



