import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.css']
})
export class ClientUploadComponent {
  selectedFile: File | null = null;

  constructor(private apiService: APIService, private toastr: NgToastService,
    private router: Router ) {}
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadClients(): void {
    if (this.selectedFile) {
      this.apiService.uploadClients(this.selectedFile).subscribe(
        (response) => {
          console.log('Upload successful:', response);
          this.toastr.success({
            detail: "SUCCESS",
            summary: "The client list was successfully uploaded!",
            duration: 50000,
          })
          this.router.navigate(['project-manager']);
        },
        (error) => {
          console.error('Upload failed:', error);
          this.toastr.error({
            detail: "ERROR",
            summary: "The client list could not be uplaoded. Please try again, or contact IT support.",
            duration: 50000,
          })
        }
      );
    } else {
      console.error('No file selected');
      // Handle error (no file selected) here
    }
  }
}
