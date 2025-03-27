import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  title: string = '';
  description: string = '';
  priority: 'low' | 'medium' | 'high' = 'medium';

  constructor(private todoService: TodoService) {}

  addTodo(): void {
    if (!this.title.trim()) return;

    this.todoService.addTodo({
      title: this.title,
      description: this.description,
      completed: false,
      priority: this.priority
    });

    // Reset form
    this.title = '';
    this.description = '';
    this.priority = 'medium';
  }
}