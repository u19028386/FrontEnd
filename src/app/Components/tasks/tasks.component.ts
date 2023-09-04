import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{
  tasks: any[] = [];
  selectedTask: any = {};
  isEditing = false;

  constructor(private apiService: APIService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.apiService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }
  addTask(task: any): void {
    this.apiService.addTask(task).subscribe(
      (data) => {
        this.tasks.push(data);
        this.clearSelectedTask();
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }

  editTask(id: number, task: any): void {
    this.apiService.editTask(id, task).subscribe(
      (data) => {
        const index = this.tasks.findIndex(t => t.taskId === id);
        if (index !== -1) {
          this.tasks[index] = data;
          this.clearSelectedTask();
        }
      },
      (error) => {
        console.error('Error editing task:', error);
      }
    );
  }

  deleteTask(id: number): void {
    this.apiService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter(t => t.taskId !== id);
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  selectTask(task: any): void {
    this.selectedTask = { ...task };
    this.isEditing = true;
  }

  clearSelectedTask(): void {
    this.selectedTask = {};
    this.isEditing = false;
  }

}
