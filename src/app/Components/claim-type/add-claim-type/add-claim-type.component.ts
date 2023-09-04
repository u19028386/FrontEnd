import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ClaimServiceService } from 'src/app/services/claim-service.service';
import { ClaimType } from 'src/app/shared/claimType';

@Component({
  selector: 'app-add-claim-type',
  templateUrl: './add-claim-type.component.html',
  styleUrls: ['./add-claim-type.component.css']
})
export class AddClaimTypeComponent implements OnInit{
  claimTypeForm = new FormGroup({
    claimTypeName: new FormControl(''),
    claimTypeDescription: new FormControl('')
  });


  constructor(private router: Router, private claimTypeService: ClaimServiceService, private toast: NgToastService) {}


  ngOnInit(): void {}


  cancel() {
    this.router.navigate(['/Claim-type']);
  }
  onSubmit() {
    const claimTypeName: string = this.claimTypeForm.get('claimTypeName')?.value || '';
    const claimTypeDescription: string = this.claimTypeForm.get('claimTypeDescription')?.value || '';
 
    
    if (!/^[A-Za-z\s]+$/.test(claimTypeName)) {
    
      this.toast.error({ detail: 'Validation Error', summary: 'Please enter a valid claim type name with no numbers or special characters.', duration: 5000 });
      return;
    }
 
    
    this.claimTypeService.getAllClaimTypes().subscribe(
      (claimTypes: ClaimType[]) => {
        const existingClaimTypeNames = claimTypes.map(ct => ct.claimTypeName.toLowerCase());
 
        if (existingClaimTypeNames.includes(claimTypeName.toLowerCase())) {
          
          this.toast.error({ detail: 'Validation Error', summary: 'Claim type name already exists.', duration: 5000 });
          return;
        }
 
        
        const claimType: ClaimType = {
          claimTypeId: 0, 
          claimTypeName: claimTypeName,
          claimTypeDescription: claimTypeDescription,
          
        };
 
        this.claimTypeService.addClaimType(claimType).subscribe(
          result => {
           
            this.toast.success({ detail: 'Success', summary: 'Claim type added successfully.', duration: 5000 });
            this.router.navigate(['/Claim-type']);
          },
          error => {
           
            this.toast.error({ detail: 'Error', summary: 'Error adding claim type.', duration: 5000 });
          }
        );
      },
      error => {
        console.error('Error fetching claim types:', error);
      }
    );
  }
 


}
