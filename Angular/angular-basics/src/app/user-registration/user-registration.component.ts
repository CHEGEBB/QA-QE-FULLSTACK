import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})
export class UserRegistrationComponent {
  user = {
    username:"",
    email:""
  }
  onSubmit (){
    console.log(this.user);
    this.user = {username:"", email:""} 
  }
}

