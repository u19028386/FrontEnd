import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inactive-warning',
  templateUrl: './inactive-warning.component.html',
  styleUrls: ['./inactive-warning.component.css']
 
})
export class InactiveWarningComponent implements OnInit {
  toastVisible: boolean = false;
  countdown: number = 30;
  


  constructor(private router: Router) { }


  ngOnInit() {
    this.startToasting();
  }


  startToasting() {
    this.toastVisible = true;
    this.countdown = 30;


    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(timer);
        // this.toastVisible = false;
        this.redirectToAnotherPage();
        this.closeToaster();
      }
    }, 1000);
  }


  closeToaster() {
    this.toastVisible = false;
  }


  redirectToAnotherPage() {
    this.router.navigate(['/login']);
    this.toastVisible = false;
  }
}
// need to fix the visibility when moving to login page
