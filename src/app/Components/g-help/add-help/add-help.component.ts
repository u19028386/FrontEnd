import { Component } from '@angular/core';
import { HelpService } from 'src/app/services/help.service';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { HelpType } from 'src/app/shared/helpType';
import { Help } from 'src/app/shared/help';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-help',
  templateUrl: './add-help.component.html',
  styleUrls: ['./add-help.component.css']
})
export class AddHelpComponent {
  helpName: string = '';
  helpDescription: string = '';
  helpType: number = 0;
  material: File | null = null;
  helpTypes: HelpType[] = [];
  format:string ='';


  constructor(
    private helpService: HelpService,
    private helpTypeService: HelpTypeService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.loadHelpTypes();
  }


  cancel() {
    this.router.navigate(['/help']);
  }


  loadHelpTypes(): void {
    this.helpTypeService.GetAllHelpType().subscribe(
      (helpTypes: HelpType[]) => {
        this.helpTypes = helpTypes;
      },
      (error) => {
        console.log('Error loading Help Types:', error);
      }
    );
  }


  onFileChange(event: any): void {
    this.material = event.target.files.item(0);
  }


  onSubmit(): void {
    if (!this.material) {
      this.toast.error({
        detail: 'Validation Error',
        summary: 'Please select a file.',
        duration: 5000
      });
      return;
    }


    const isManualHelp = this.helpTypes.find(
      (helpType) =>
        helpType.helpTypeId === this.helpType &&
        helpType.helpTypeName === 'manual'
    );


    const isVideoHelp = this.helpTypes.find(
      (helpType) =>
        helpType.helpTypeId === this.helpType && helpType.helpTypeName === 'video'
    );


    if (
      (isManualHelp && this.material.type !== 'application/pdf') ||
      (isVideoHelp && !this.isVideoFile(this.material))
    ) {
      this.toast.error({
        detail: 'Validation Error',
        summary: 'Invalid file format. Please upload a valid file.',
        duration: 5000
      });
      return;
    }


    if (!/^[A-Za-z\s]+$/.test(this.helpName)) {
      this.toast.error({
        detail: 'Validation Error',
        summary: 'Please enter a valid help name with no numbers or special characters.',
        duration: 5000
      });
      return;
    }


    if (typeof this.helpDescription !== 'string' || this.helpDescription.trim() === '') {
      this.toast.error({
        detail: 'Validation Error',
        summary: 'Please enter a valid help description.',
        duration: 5000
      });
      return;
    }


    const formData = new FormData();
    formData.append('helpName', this.helpName);
    formData.append('helpDescription', this.helpDescription);
    formData.append('helpTypeId', this.helpType.toString());
    formData.append('material', this.material);


    this.helpService.AddHelp(formData).subscribe(
      (newHelp: Help) => {
        this.toast.success({
          detail: 'Success',
          summary: 'Help added successfully.',
          duration: 5000
        });
        this.router.navigate(['/help']);
      },
      (error) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Error adding Help.',
          duration: 5000
        });
      }
    );
  }


  private isVideoFile(file: File): boolean {
    const videoExtensions = ['.mp4'];
    const fileNameParts = file.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    return videoExtensions.includes(fileExtension);
  }




 
  findSso(selectedVendor: any){
    console.log('Got the selectedVendor as : ',(selectedVendor));


    if (selectedVendor ==2) {
      this.format = '.pdf';
    } else if (selectedVendor==1) {
      this.format = '.mp4';
    } else {
     this.format =  '';
    }
    console.log(this.format);
  }
}
