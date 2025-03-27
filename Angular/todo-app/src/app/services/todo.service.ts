import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Learn Angular',
      description: 'Master Angular fundamentals and build applications',
      completed: false,
      createdAt: new Date(),
      priority: 'high'
    },
    {
      id: 2,
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, fruits',
      completed: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      priority: 'medium'
    }
  ];

  private todosSubject = new BehaviorSubject<Todo[]>(this.todos);

  constructor() { }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): void {
    const newTodo: Todo = {
      ...todo,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    this.todos = [...this.todos, newTodo];
    this.todosSubject.next(this.todos);
  }

  updateTodo(updatedTodo: Todo): void {
    this.todos = this.todos.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    this.todosSubject.next(this.todos);
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todosSubject.next(this.todos);
  }

  toggleComplete(id: number): void {
    this.todos = this.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosSubject.next(this.todos);
  }

  private generateId(): number {
    return this.todos.length > 0 
      ? Math.max(...this.todos.map(todo => todo.id)) + 1 
      : 1;
  }
}