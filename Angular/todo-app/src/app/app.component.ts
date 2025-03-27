import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TodoFormComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';

  // filter:'all' | 'active' |'done'= 'all';

  // allItems = [
  //   { description: "eat", done: true },
  //   { description: "sleep", done: false },
  //   { description: "play", done: false },
  //   { description: "laugh", done: false },
  // ];

  // get items(){
  //   if(this.filter === 'all'){
  //     return this.allItems
  //   }
  //   return this.allItems.filter(item =>
  //     this.filter === 'done'? item.done : !item.done
  //   )
  // }
}