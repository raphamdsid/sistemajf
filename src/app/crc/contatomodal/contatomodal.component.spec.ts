import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContatomodalComponent } from './contatomodal.component';

describe('ContatomodalComponent', () => {
  let component: ContatomodalComponent;
  let fixture: ComponentFixture<ContatomodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContatomodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatomodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
