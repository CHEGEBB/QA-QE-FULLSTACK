import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { JobApplicationComponent } from './job-application.component';

describe('JobApplicationComponent', () => {
  let component: JobApplicationComponent;
  let fixture: ComponentFixture<JobApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationComponent, ReactiveFormsModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(JobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.jobForm.valid).toBeFalsy();
  });

  it('should add and remove skills', () => {
    component.addSkill();
    expect(component.skills.length).toBe(1);
    
    component.removeSkill(0);
    expect(component.skills.length).toBe(0);
  });
});