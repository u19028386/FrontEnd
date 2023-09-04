export class User {
  userId: number = 0;
  titleId: number = 0;
  idNumber: string = '';
  firstName: string = '';
  lastName: string = '';
  prefferedName: string = '';
  emailAddress: string = '';
  cellphoneNumber: string = '';
  dateOfHire: Date = new Date();
  isActive: boolean = false;
  dateOfCreation: Date = new Date();
  alerts: any[] = [];
  auditLogs: any[] = [];
  employees: any[] = [];
  passwords: any[] = [];
  systemAdministrators: any[] = [];
  title: any = null;
  userUserRoles: any[] = [];
}


export class Project {
  projectId: number;
  adminId: number;
  clientId: number;
  projectStatusId: number;
  projectName: string;
  startDate!: Date;
  endDate!: Date;
  admin: any; // Replace 'any' with the type of 'admin' property if available
  client: any; // Replace 'any' with the type of 'client' property if available
  projectAllocations!: any[]; // Replace 'any' with the type of 'projectAllocations' property if available
  projectStatus: any; // Replace 'any' with the type of 'projectStatus' property if available
  tasks!: any[]; // Replace 'any' with the type of 'tasks' property if available
  timecards!: any[]; // Replace 'any' with the type of 'timecards' property if available
  timesheets!: any[]; // Replace 'any' with the type of 'timesheets' property if available




  constructor(
 
  ) {
    this.projectId = 0;
    this.adminId = 0;
    this.clientId = 0;
    this.projectStatusId = 0;
    this.projectName = "";
 
  }
}
export class ProjectAllocation {
  public projectAllocationId: number =0;
  public projectId?: number | null;
  public employeeId?: number | null;
  public totalNumHours?: number | null;
  public expectedNumHours?: number | null;
  public billableOverTime?: number | null;
  public employee?: any | null;
  public project?: Project | null;
}
