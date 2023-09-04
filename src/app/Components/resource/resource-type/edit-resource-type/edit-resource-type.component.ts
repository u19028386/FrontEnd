import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { EditConfirmationModalComponent } from 'src/app/Components/edit-confirmation-modal/edit-confirmation-modal.component';
import { DataService } from 'src/app/services/data.service';
import { ResourceTypeService } from 'src/app/services/resource-type.service';
import { Resourcetype } from 'src/app/shared/resourceType';



@Component({
  selector: 'app-edit-resource-type',
  templateUrl: './edit-resource-type.component.html',
  styleUrls: ['./edit-resource-type.component.css'],
})
export class EditResourceTypeComponent implements OnInit {
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


    resourcetypeForm = new FormGroup({
        resourceTypeName: new FormControl('', Validators.required),
        resourceTypeDescription: new FormControl('', Validators.required)
  });


  resourcetype: Resourcetype | null = null;
  existingResourceTypeNames: string[] = [];
  originalResourceTypeName: string | null = null;
  originalResourceTypeDescription: string | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  resourcetypes: Resourcetype[] = [];
  displayModal: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getExistingResourceTypeNames();
    this. getExistingBoth();


    this.dataService.getResourcetype(+this.route.snapshot.params['id']).subscribe((result) => {
        this.resourcetype = result as Resourcetype;
        if (this.resourcetype) {


          this.originalResourceTypeName = this.resourcetype.resourceTypeName;
        this.originalResourceTypeDescription = this.resourcetype.resourceTypeDescription;


          this.resourcetypeForm.patchValue({
            resourceTypeName: this.resourcetype.resourceTypeName || '',
            resourceTypeDescription: this.resourcetype.resourceTypeDescription || ''
          });
        }
      });
  }


  getExistingResourceTypeNames() {
    this.dataService.getResourceTypes().subscribe((resourceTypes: Resourcetype[]) => {
      this.existingResourceTypeNames = resourceTypes
        .map((resourceType) => resourceType.resourceTypeName)
        .filter((name) => !!name);
    });
  }


  getExistingBoth() {
    this.dataService.getResourceTypes().subscribe((resourceTypes: Resourcetype[]) => {
      this.existingResourceTypeNames = resourceTypes
        .map((resourceType) => resourceType.resourceTypeName)
        .filter((name) => !!name);
    });


    const id = +this.route.snapshot.params['id'];
    this.dataService.getResourcetype(id).subscribe((result) => {
      this.resourcetype = result as Resourcetype;
      if (this.resourcetype) {
        this.originalResourceTypeName = this.resourcetype.resourceTypeName;
        this.originalResourceTypeDescription = this.resourcetype.resourceTypeDescription;
        this.resourcetypeForm.patchValue({
            resourceTypeName: this.resourcetype.resourceTypeName || '',
            resourceTypeDescription: this.resourcetype.resourceTypeDescription || ''
        });
      }
    });
  }


  cancel() {
    this.router.navigate(['/resourcetype']);
  }


  openEditModal(resourcetype: Resourcetype) {
    this.itemToEdit = resourcetype.resourceTypeName;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.resourcetype) {
      return;
    }
 
    if (
      this.resourcetypeForm.value.resourceTypeName === this.originalResourceTypeName&&
      this.resourcetypeForm.value.resourceTypeDescription === this.originalResourceTypeDescription
    ) {
      this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the resource type.', duration: 5000 });
      return;
    }
 
    const updatedResourceType: Resourcetype = {
      resourceTypeId: this.resourcetype.resourceTypeId,
      resourceTypeName : this.resourcetypeForm.value.resourceTypeName || '',
      resourceTypeDescription : this.resourcetypeForm.value.resourceTypeDescription  || ''
    };
 
    this.dataService.editResourceType(this.resourcetype.resourceTypeId, updatedResourceType).subscribe(
      (result) => {
        this.toast.success({ detail: 'Success Message', summary: 'Resource type updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/resourcetype']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Failed to update resource type.', duration: 5000 });
      }
    );
  }
}

