export interface ProjectAllocationView {

    projectAllocationId: number;
    projectId: number;
    employeeId : number;
    isEligibleToClaim : boolean;
    claimableAmount : number;
    totalNumHours : number;
    billableOverTime : number;
    isOperationalManager : boolean;
    isProjectManager : boolean;
    pName : string;
    claim : string;
    firstName : string;
    lastName  : string;
  }


