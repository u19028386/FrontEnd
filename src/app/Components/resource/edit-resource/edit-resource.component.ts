import { Component, OnInit, ViewChild } from '@angular/core';
import { EditConfirmationModalComponent } from '../../edit-confirmation-modal/edit-confirmation-modal.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Resource } from 'src/app/shared/resource';
import { Resourcetype } from 'src/app/shared/resourceType';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.css']
})
export class EditResourceComponent implements OnInit{
  @ViewChild(EditConfirmationModalComponent) editConfirmationModal!: EditConfirmationModalComponent;


  resourceForm = new FormGroup({
    resourceName: new FormControl('', Validators.required),
    resourceDescription : new FormControl('', Validators.required),
    resourceTypeId: new FormControl<number | null>(null, Validators.required)
  });


  resourceId!: number;
  resource: Resource | null = null;
  resourceTypes: Resourcetype[] = [];
  existingResourceNames: string[] = [];


  originalResourceName: string | null = null;
  originalResourceDescription: string | null = null;
  originalResourceTypeId : number | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  resources : Resource[] = [];
  displayModal: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getResourceTypes();
   
    this.dataService.getResource(+this.route.snapshot.params['id']).subscribe((result) => {
      this.resource = result as Resource;
      if (this.resource) {
        this.originalResourceName = this.resource.resourceName;
        this.originalResourceDescription = this.resource.resourceDescription;
        this.originalResourceTypeId = this.resource.resourceTypeId;


        this.resourceForm.patchValue({
          resourceName : this.resource.resourceName || '',
          resourceDescription : this.resource.resourceDescription || '',
          resourceTypeId : this.resource.resourceTypeId
        });
      }
    });
   
  }


  getResourceTypes() {
    this.dataService.getResourceTypes().subscribe((types: Resourcetype[]) => {
      this.resourceTypes = types;
    });
  }


  cancel() {
    this.router.navigate(['/resource']);
  }


  openEditModal(resource: Resource) {
    this.itemToEdit = resource.resourceName;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.resource) {
      return;
    }


   
    if (
      this.resourceForm.value.resourceName === this.originalResourceName &&
      this.resourceForm.value.resourceDescription === this.originalResourceDescription &&
      this.resourceForm.value.resourceTypeId === this.originalResourceTypeId
   
    ){
        this.toast.error({ detail: 'Error Message', summary: 'No changes were made to the resource.', duration: 5000 });
        return;
      }


      const updatedResource: Resource = {
              resourceId: this.resource.resourceId,
              resourceName : this.resourceForm.value.resourceName || '',
              resourceDescription: this.resourceForm.value.resourceDescription || '',
              resourceTypeId: this.resourceForm.value.resourceTypeId as number
            };
 
 
    this.dataService.editResource(this.resource.resourceId, updatedResource).subscribe(
      (result) => {
        this.toast.success({ detail: 'Success Message', summary: 'Resource updated successfully', duration: 5000 });
        this.itemToEdit = '';
        this.closeModal();
        this.router.navigate(['/resource']);
      },
      (error) => {
        this.toast.error({ detail: 'Error Message', summary: 'Failed to update resource.', duration: 5000 });
      }
    );
  }


}


