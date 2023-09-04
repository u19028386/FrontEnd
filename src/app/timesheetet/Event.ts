

export class Events {
  id: number =0;
  Employee: string;
  Project : string;
  Text: string;
  start: Date;
  end: Date;
  barColor: string;


  constructor(
    Employee: string,
    Project: string,
    text: string,
    start: string, // Use string instead of Date for start and end properties
    end: string,
    barColor: string
  ) {
    this.Employee = Employee;
    this.Project = Project;
    this.Text = text;
    this.start = new Date(start); // Convert string to Date
    this.end = new Date(end); // Convert string to Date
    this.barColor = barColor;
  }
}


export class EmployeeReportVM {
  projectName: string;
  totalHours: number;
  start: Date;
  end: Date;


  constructor(projectName: string, totalHours: number,start: string,end: string,)
  {
      this.projectName = projectName;
      this.totalHours = totalHours;
      this.start = new Date(start);
      this.end = new Date(end);


  }
}