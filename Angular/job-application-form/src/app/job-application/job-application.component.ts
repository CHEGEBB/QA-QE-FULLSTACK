import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.css'
})
export class JobApplicationComponent {
  jobForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      skills: this.fb.array([])
    });
  }

  // Safe method to get form control
  getControl(path: string): AbstractControl | null {
    const control = this.jobForm.get(path);
    return control || null;
  }

  // Getter for easy access to skills FormArray
  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
  }

  // Method to add a new skill input
  addSkill() {
    const skillControl = this.fb.group({
      name: ['', Validators.required],
      experience: [null, [Validators.min(0), Validators.max(50)]]
    });
    this.skills.push(skillControl);
  }

  // Method to remove a skill input
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Form submission method
  onSubmit() {
    if (this.jobForm.valid) {
      console.log(this.jobForm.value);
      // Here you would typically send the form data to a backend service
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.jobForm);
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}