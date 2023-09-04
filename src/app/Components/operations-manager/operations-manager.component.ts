import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-operations-manager',
  templateUrl: './operations-manager.component.html',
  styleUrls: ['./operations-manager.component.css']
})
export class OperationsManagerComponent {

  constructor(private apiService: APIService){}
  logOut()
  {
    this.apiService.logOut();
  }
}
