import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmwaitestornoexComponent } from './modalconfirmwaitestornoex.component';

describe('ModalconfirmwaitestornoexComponent', () => {
  let component: ModalconfirmwaitestornoexComponent;
  let fixture: ComponentFixture<ModalconfirmwaitestornoexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmwaitestornoexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmwaitestornoexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
