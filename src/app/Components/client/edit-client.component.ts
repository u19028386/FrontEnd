import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from 'src/app/services/data.service';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';
import { EditConfirmationModalComponent } from '../edit-confirmation-modal/edit-confirmation-modal.component';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
//   styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


  clientForm = new FormGroup({
    account: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    siteCode: new FormControl('', Validators.required),
    projectCode: new FormControl('', Validators.required),
    accountManager: new FormControl('', Validators.required)
  });


  client: Client | null = null;
  existingAccounts: string[] = [];
  originalAccount: string | null = null;
  originalDepartment: string | null = null;
  originalSiteCode: string | null = null;
  originalProjectCode: string | null = null;
  originalAccountManager: string | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  clients: Client[] = [];
  displayModal: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getExistingAccounts();
    this.getExistingAll();


    this.dataService.getClient(+this.route.snapshot.params['id']).subscribe((result) => {
      this.client = result as Client;
      if (this.client) {
        this.originalAccount = this.client.account;
        this.originalAccountManager = this.client.accountManager;
        this.originalDepartment = this.client.department;
        this.originalProjectCode = this.client.projectCode;
        this.originalSiteCode = this.client.siteCode;


        this.clientForm.patchValue({
          account: this.client.account || '',
          department: this.client.department || '',
          accountManager: this.client.accountManager || '',
          siteCode: this.client.siteCode || '',
          projectCode: this.client.projectCode || ''
        });
      }
    });
  }


  getExistingAccounts() {
    this.dataService.getClients().subscribe((clients: Client[]) => {
      this.existingAccounts = clients
        .map((client) => client.account)
        .filter((name) => !!name);
    });
  }


  getExistingAll() {
        this.dataService.getClients().subscribe((clients: Client[]) => {
          this.existingAccounts = clients
            .map((client) => client.account)
            .filter((name) => !!name);
        });
   
        const id = +this.route.snapshot.params['id'];
        this.dataService.getClient(id).subscribe((result) => {
          this.client = result as Client;
          if (this.client) {
             this.originalAccount = this.client.account;
             this.originalAccountManager = this.client.accountManager;
             this.originalDepartment = this.client.department;
             this.originalProjectCode = this.client.projectCode;
             this.originalSiteCode = this.client.siteCode;
   
             this.clientForm.patchValue({
                account : this.client.account || '',
                department : this.client.department || '',
                accountManager : this.client.accountManager || '',
                siteCode : this.client.siteCode || '',
                projectCode : this.client.projectCode || ''
              });
          }
        });
      }
   
  cancel() {
    this.router.navigate(['/client']);
  }


  openEditModal(client: Client) {
    this.itemToEdit = client.account;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.client) {
      return;
    }
 
    const editedAccount = this.clientForm.value.account || '';
 
    if (editedAccount !== this.originalAccount && this.existingAccounts.includes(editedAccount)) {
      this.toast.error({ detail: 'Error Message', summary: 'Client account already exists. Please enter a unique name.', duration: 5000 });
      return;
    }
 
    const projectCode = this.clientForm.value.projectCode || '';
    const siteCode = this.clientForm.value.siteCode || '';
 
    if (!/^\d{4}$/.test(projectCode)) {
      this.toast.error({ detail: 'Error Message', summary: 'Project Code must be 4 numeric characters long.', duration: 5000 });
      return;
    }
 
    if (!/^[A-Z]{4}$/.test(siteCode)) {
      this.toast.error({ detail: 'Error Message', summary: 'Site Code must be 4 uppercase letters.', duration: 5000 });
      return;
    }
 
    if (
      this.clientForm.value.account === this.originalAccount &&
      this.clientForm.value.accountManager === this.originalAccountManager &&
      this.clientForm.value.department === this.originalDepartment &&
      this.clientForm.value.projectCode === this.originalProjectCode &&
      this.clientForm.value.siteCode === this.originalSiteCode
    ) {
      this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the client.', duration: 5000 });
      return;
    }
 
    const updatedClient: Client = {
      clientId: this.client.clientId,
      account: this.clientForm.value.account || '',
      department: this.clientForm.value.department || '',
      accountManager: this.clientForm.value.accountManager || '',
      siteCode: this.clientForm.value.siteCode || '',
      projectCode: this.clientForm.value.projectCode || '',
    };
 
    this.dataService.editClient(this.client.clientId, updatedClient).subscribe(
      (result) => {
        this.toast.success({ detail: 'Success Message', summary: 'Client updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/client']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Failed to update client.', duration: 5000 });
      }
    );
  }
 
 
 
}
