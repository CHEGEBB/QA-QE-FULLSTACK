import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  
  constructor(private todoService: TodoService) {}
  
  ngOnInit(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }
  
  get filteredTodos(): Todo[] {
    switch(this.filterStatus) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }
  
  setFilter(status: 'all' | 'active' | 'completed'): void {
    this.filterStatus = status;
  }
  
  getCompletedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }
  
  getRemainingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }
}