
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  clientForm = new FormGroup({
    account: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    siteCode: new FormControl('', Validators.required),
    projectCode: new FormControl('', Validators.required),
    accountManager: new FormControl('', Validators.required)
  });


  existingAccounts: string[] = [];
  isSubmitted: boolean = false;


  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}


  ngOnInit(): void {
 
    this.getExistingAccounts();
  }


  getExistingAccounts() {
    this.dataService.getClients().subscribe((clients: Client[]) => {
      this.existingAccounts = clients
        .map((client) => client.account)
        .filter((name) => name !== null) as string[];
    });
  }


  cancel() {
    this.router.navigate(['/client']);
  }


  onSubmit() {
    this.isSubmitted = true;


    if (this.clientForm.invalid) {
      return;
    }


    const account : string = this.clientForm.get('account')?.value || '';
    const department : string = this.clientForm.get('department')?.value || '';
    const siteCode : string = this.clientForm.get('siteCode')?.value || '';
    const projectCode : string = this.clientForm.get('projectCode')?.value || '';
    const accountManager : string = this.clientForm.get('accountManager')?.value || '';


    if (this.existingAccounts.includes(account)) {
      this.toast.error({ detail: 'Error Message', summary: 'Account name already exists. Please enter a unique name.', duration: 5000 });
      return;
    }


 
    if (!/^\d{4}$/.test(projectCode)) {
      this.toast.error({ detail: 'Error Message', summary: 'Project Code must be 4 numeric characters long.', duration: 5000 });
      return;
    }


    if (!/^[A-Z]{4}$/.test(siteCode)) {
      this.toast.error({ detail: 'Error Message', summary: 'Site Code must be 4 uppercase letters.', duration: 5000 });
      return;
    }
   
    const client : Client = {
      clientId: 0,
      account : account,
      accountManager : accountManager,
      siteCode : siteCode,
      projectCode : projectCode,
      department : department
     
    };


    this.dataService.addClient(client).subscribe((result) => {
      this.toast.success({ detail: 'Success Message', summary: 'Client added succcessfully', duration: 5000 });
      this.router.navigate(['/client']);
    },
    error => {
      this.toast.error({ detail: 'Error Message', summary: 'Client could not be added.', duration: 5000 });
     
    });
  }
}


