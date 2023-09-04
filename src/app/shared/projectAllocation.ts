export interface ProjectAllocation {
    projectAllocationId: number;
    projectId: number;
    employeeId : number;
    isEligibleToClaim : boolean;
    claimableAmount : number;
    totalNumHours : number;
    billableOverTime : number;
    isOperationalManager : boolean;
    isProjectManager : boolean;
    claimItemId : number;
  }
