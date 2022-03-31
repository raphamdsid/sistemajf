import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalbancoComponent } from './modalbanco.component';

describe('ModalbancoComponent', () => {
  let component: ModalbancoComponent;
  let fixture: ComponentFixture<ModalbancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalbancoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalbancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
