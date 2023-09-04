import { Component } from '@angular/core';
import { ClaimCaptureview } from '../shared/claimCaptureView';
import { ClaimcaptureService } from '../services/claimcapture.service';

@Component({
  selector: 'app-claim-capture',
  templateUrl: './claim-capture.component.html',
  styleUrls: ['./claim-capture.component.css']
})
export class ClaimCaptureComponent {
  claims: ClaimCaptureview [] =[];


  constructor(private claimcaptureservice :ClaimcaptureService){}
  ngOnInit(): void {
    this.getAllClaimCapture();
  }


getAllClaimCapture(){
  this.claimcaptureservice.getAllClaimCaptures().subscribe((result:ClaimCaptureview[]) => {
    this.claims =result;
  })


}

}
