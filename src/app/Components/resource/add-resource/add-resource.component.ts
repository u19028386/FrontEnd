import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DataService } from 'src/app/services/data.service';
import { Resource } from 'src/app/shared/resource';
import { Resourcetype } from 'src/app/shared/resourceType';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.css']
})
export class AddResourceComponent implements OnInit{
  resourceForm = new FormGroup({
    resourceName: new FormControl('', Validators.required),
    resourceDescription: new FormControl('', Validators.required),
    resourceTypeId: new FormControl('', Validators.required)
  });


  existingResourceNames: string[] = [];
  resourceTypes: Resourcetype[] = [];


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getExistingResourceTypeNames();
    this.getResourceTypes();
  }


  getExistingResourceTypeNames() {
    this.dataService.getResources().subscribe((resources: Resource[]) => {
      this.existingResourceNames = resources.map(
        (resource) => resource.resourceName
      );
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


  onSubmit() {
    const resourceName: string = this.resourceForm.get('resourceName')?.value || '';
    const resourceDescription: string = this.resourceForm.get('resourceDescription')?.value || '';
    const resourceTypeId: number = parseInt(this.resourceForm.get('resourceTypeId')?.value ?? '0', 10);


    if (this.existingResourceNames.includes(resourceName)) {
      this.toast.error({detail: 'Error Message', summary: 'Resource name already exists. Please enter a unique name.', duration: 5000
      });


      return;
    }


    const resource: Resource = {
      resourceId: 0,
      resourceName: resourceName,
      resourceDescription: resourceDescription,
      resourceTypeId: resourceTypeId
    };


    this.dataService.addResource(resource).subscribe((result) => {
      this.toast.success({detail: 'Success Message', summary: 'Resource added successfully', duration: 5000
      });
      this.router.navigate(['/resource']);
    },
    error => {
      this.toast.error({ detail: 'Error Message', summary: 'Resource could not be added.', duration: 5000 });
     
    });
  }
}

