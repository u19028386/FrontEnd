import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { HelpType } from 'src/app/shared/helpType';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-help-type',
  templateUrl: './add-help-type.component.html',
  styleUrls: ['./add-help-type.component.css']
})
export class AddHelpTypeComponent implements OnInit {
  HelptypeForm = new FormGroup({
    helpTypeName: new FormControl(''),
    helpTypeDescription: new FormControl('')
  });


  constructor(private router: Router, private helptypeservice: HelpTypeService, private toast: NgToastService) {}


  ngOnInit(): void {}


  cancel() {
    this.router.navigate(['/help-type']);
  }


  onSubmit(): void {
    const helpTypeName: string = this.HelptypeForm.get('helpTypeName')?.value || '';
    const helpTypeDescription: string = this.HelptypeForm.get('helpTypeDescription')?.value || '';


    // Validate help type name as a string/text without numbers or special characters
    if (!/^[A-Za-z\s]+$/.test(helpTypeName)) {
      // Display error toast for invalid help type name
      this.toast.error({ detail: 'Validation Error', summary: 'Please enter a valid help type name with no numbers or special characters.', duration: 5000 });
      return;
    }


    // Validate help type description as a string/text
    if (typeof helpTypeDescription !== 'string' || helpTypeDescription.trim() === '') {
      // Display error toast for invalid help type description
      this.toast.error({ detail: 'Validation Error', summary: 'Please enter a valid help type description.', duration: 5000 });
      return;
    }


    // Fetch existing help type names
    this.helptypeservice.GetAllHelpType().subscribe(
      (helpTypes: HelpType[]) => {
        const existingHelpTypeNames = helpTypes.map(ht => ht.helpTypeName.toLowerCase());
       


        if (existingHelpTypeNames.includes(helpTypeName)) {
          // Display error toast for existing help type name
          this.toast.error({ detail: 'Validation Error', summary: 'Help type name already exists.', duration: 5000 });
          return;
        }


        // Proceed to add the help type since the name is unique
        const helpType: HelpType = {
          helpTypeId: 0,
          helpTypeName: helpTypeName,
          helpTypeDescription: helpTypeDescription,
        };


        this.helptypeservice.AddHelpType(helpType).subscribe(
          result => {
            // Display success toast for help type added
            this.toast.success({ detail: 'Success', summary: 'Help type added successfully.', duration: 5000 });
            this.router.navigate(['/help-type']);
          },
          error => {
            // Display error toast for help type addition failure
            this.toast.error({ detail: 'Error', summary: 'Error adding help type.', duration: 5000 });
          }
        );
      },
      error => {
        console.error('Error fetching help types:', error);
      }
    );
  }
}

