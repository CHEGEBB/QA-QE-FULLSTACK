import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobApplicationComponent } from './job-application/job-application.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JobApplicationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'job-application-form';
}
