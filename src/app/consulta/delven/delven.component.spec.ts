import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelvenComponent } from './delven.component';

describe('DelvenComponent', () => {
  let component: DelvenComponent;
  let fixture: ComponentFixture<DelvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelvenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
