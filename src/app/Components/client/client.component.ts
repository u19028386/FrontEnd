
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { saveAs } from 'file-saver';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
  })
  export class ClientComponent implements OnInit {
    @ViewChild(DeleteConfirmationModalComponent) deleteConfirmationModal!: DeleteConfirmationModalComponent;


    deleteMessage: string = 'Are you sure you want to delete the item?';
    clients: Client[] = [];
  filtered: Client[] = [];
  searchName: string = '';
  itemToDelete: string = '';
 
  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}
 
  ngOnInit(): void {
      this.getClients();
    }




    getClients() {
            this.dataService.getClients().subscribe((result: Client[]) => {
              this.clients = result;
              this.filtered = result;
            });
          }


          openDeleteModal(client: Client) {
            this.itemToDelete = client.account;
            this.deleteConfirmationModal.openModal(this.itemToDelete);
          }
       
          deleteConfirmed() {
            if (this.itemToDelete) {
              const clientToDelete = this.clients.find((client) => client.account === this.itemToDelete);
              if (clientToDelete) {
                this.dataService.deleteClient(clientToDelete.clientId).subscribe(
                  (result) => {
                    this.toast.success({ detail: 'Success Message', summary: 'Client deleted successfully', duration: 5000 });
                  window.location.reload();
                  },
                  (error) => {
                    this.toast.error({ detail: 'Error Message', summary: 'Failed to delete client.', duration: 5000 });
                  }
                );
              }
            }
       
            this.itemToDelete = '';
          }
       


    search(): void {
    if (!this.searchName) {
      this.toast.error({ detail: 'Error Message', summary: 'Please enter a search term.', duration: 5000 });
      return;
    }
 
    this.filtered = this.clients.filter((client) =>
    client.account && client.account.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

}
