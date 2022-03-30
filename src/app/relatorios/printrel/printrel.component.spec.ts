import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintrelComponent } from './printrel.component';

describe('PrintrelComponent', () => {
  let component: PrintrelComponent;
  let fixture: ComponentFixture<PrintrelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintrelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintrelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
