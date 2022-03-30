import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaclientemodalComponent } from './consultaclientemodal.component';

describe('ConsultaclientemodalComponent', () => {
  let component: ConsultaclientemodalComponent;
  let fixture: ComponentFixture<ConsultaclientemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaclientemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaclientemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
