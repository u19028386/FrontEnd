import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { HelpType } from 'src/app/shared/helpType';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-edit-help-type',
  templateUrl: './edit-help-type.component.html',
  styleUrls: ['./edit-help-type.component.css']
})
export class EditHelpTypeComponent implements OnInit {
  helpTypeForm = new FormGroup({
    helpTypeName: new FormControl(''),
    helpTypeDescription: new FormControl('')
  });


  helpType: HelpType | undefined;
  helpTypeId: number | undefined;


  constructor(
    private helpTypeService: HelpTypeService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.helpTypeId = parseInt(localStorage.getItem('helpTypeId')!, 10);
    if (!isNaN(this.helpTypeId)) {
      this.loadHelpType();
    }
  }


  loadHelpType(): void {
    this.helpTypeService.GetHelpType(this.helpTypeId!).subscribe(result => {
      this.helpType = result;
      this.populateForm();
    });
  }


  populateForm(): void {
    if (this.helpType) {
      this.helpTypeForm.patchValue({
        helpTypeName: this.helpType.helpTypeName || '',
        helpTypeDescription: this.helpType.helpTypeDescription || ''
      });
    }
  }


  cancel(): void {
    localStorage.removeItem('helpTypeId');
    this.router.navigate(['/help-type']);
  }


  onSubmit(): void {
    if (this.helpType && this.helpTypeId) {
      const updatedHelpType: HelpType = {
        helpTypeId: this.helpTypeId,
        helpTypeName: this.helpTypeForm.value.helpTypeName || '',
        helpTypeDescription: this.helpTypeForm.value.helpTypeDescription || '',
       
      };


      // Validate help type name as a string/text without numbers or special characters
      if (!/^[A-Za-z\s]+$/.test(updatedHelpType.helpTypeName)) {
        this.toast.error({
          detail:'Validation Error',
          summary: 'Please enter a valid help type name with no numbers or special characters.',
          duration: 5000
        });
        return;
      }


      // Check for changes before submitting
      if (
        updatedHelpType.helpTypeName === this.helpType.helpTypeName &&
        updatedHelpType.helpTypeDescription === this.helpType.helpTypeDescription
      ) {
        this.toast.error({ detail: 'Error', summary:'No changes made.' , duration: 5000 });
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       
          data: { title: 'Confirm Chanages', message: 'Are you sure you want to save the changes?' },
         
         width: '350px',
         height: '200px',
         position: {
        top: '0px',
        left: '600px',}
        });


        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.helpTypeService.EditHelpType(updatedHelpType.helpTypeId, updatedHelpType).subscribe(
              result => {
                this.toast.success({ detail:  'Success', summary:'Help type edited successfully.', duration: 5000 });
                this.router.navigate(['/help-type']);
              },
              error => {
                this.toast.error({ detail:'Error ', summary:  'Help type not updated', duration: 5000 });
              }
            );
          }
        });
      }
    }
  }
}

