import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.css']
})
export class ProjectProgressComponent implements OnInit, AfterViewInit{
  projectId = 1; 
  totalHours: number = 0;
  employeeHoursData: any[] = [];
  @ViewChild('progressChartCanvas', { static: false }) progressChartCanvas!: ElementRef;


  constructor(private apiService: APIService) { }

  ngOnInit(): void {
    this.apiService.getProjectTotalHours(this.projectId).subscribe(
      totalHours => {
        this.totalHours = totalHours;
        this.loadEmployeeHoursData();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.createDoughnutChart();
  }


  loadEmployeeHoursData(): void {
    this.apiService.getEmployeeHoursPerProject(this.projectId).subscribe(
      data => {
        this.employeeHoursData = data;
        this.createDoughnutChart();
      },
      error => {
        console.error('Error loading employee hours data:', error);
      }
    );
  }

  createDoughnutChart(): void {
    const ctx = this.progressChartCanvas.nativeElement.getContext('2d');

    const labels = this.employeeHoursData.map(item => `Employee ${item.EmployeeId}`);
    const data = this.employeeHoursData.map(item => item.TotalHours);

    const doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Employee Hours',
            data: data,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              // Add more colors as needed
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              // Add more colors as needed
            ],
            borderWidth: 1
          }
        ]
      }
    });
  }
}
