import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceTypeService } from 'src/app/services/resource-type.service';
import { Resourcetype } from 'src/app/shared/resourceType';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete-confirmation-modal/delete-confirmation-modal.component';
import { DataService } from 'src/app/services/data.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-resource-type',
  templateUrl: './resource-type.component.html',
  styleUrls: ['./resource-type.component.css']
})
export class ResourceTypeComponent implements OnInit {
  @ViewChild(DeleteConfirmationModalComponent) deleteConfirmationModal!: DeleteConfirmationModalComponent;


  deleteMessage: string = 'Are you sure you want to delete the item?';
  types: Resourcetype[] = [];
  filtered: Resourcetype[] = [];
  searchName: string = '';
  itemToDelete: string = '';


  constructor(private dataService: DataService, private router: Router, private toast: NgToastService) {}


  ngOnInit(): void {
    this.getResourceTypes();
  }


  getResourceTypes() {
    this.dataService.getResourceTypes().subscribe((result: Resourcetype[]) => {
      this.types = result;
      this.filtered = result;
    });
  }


  openDeleteModal(type: Resourcetype) {
    this.itemToDelete = type.resourceTypeName;
    this.deleteConfirmationModal.openModal(this.itemToDelete);
  }


  deleteConfirmed() {
    if (this.itemToDelete) {
      const typeToDelete = this.types.find((type) => type.resourceTypeName === this.itemToDelete);
      if (typeToDelete) {
        this.dataService.deleteResourceType(typeToDelete.resourceTypeId).subscribe(
          (result) => {
            this.toast.success({ detail: 'Success Message', summary: 'Resource type deleted successfully', duration: 5000 });
          window.location.reload();
          },
          (error) => {
            this.toast.error({ detail: 'Error Message', summary: 'Failed to delete resource type.', duration: 5000 });
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
 
    this.filtered = this.types.filter((type) =>
    type.resourceTypeName && type.resourceTypeName.toLowerCase().includes(this.searchName.toLowerCase())


    );


  }
}

