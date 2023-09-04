import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  @Output() hideToast = new EventEmitter<void>();
}
