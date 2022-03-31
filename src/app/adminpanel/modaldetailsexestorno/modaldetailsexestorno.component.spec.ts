import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldetailsexestornoComponent } from './modaldetailsexestorno.component';

describe('ModaldetailsexestornoComponent', () => {
  let component: ModaldetailsexestornoComponent;
  let fixture: ComponentFixture<ModaldetailsexestornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldetailsexestornoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldetailsexestornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
