export interface Task {
    taskId: number;
    employeeId: number;
    projectId: number;
    taskStatusId: number;
    priorityId: number;
    taskTypeId: number;
    taskName: string;
    taskDescription: string;
    dueDate: Date;
    isComplete: boolean;
  }