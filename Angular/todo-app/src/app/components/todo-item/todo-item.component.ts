import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  expanded = false;

  constructor(private todoService: TodoService) {}

  toggleComplete(): void {
    this.todoService.toggleComplete(this.todo.id);
  }

  deleteTodo(): void {
    this.todoService.deleteTodo(this.todo.id);
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}