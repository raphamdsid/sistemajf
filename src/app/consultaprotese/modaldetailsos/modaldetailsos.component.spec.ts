import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldetailsosComponent } from './modaldetailsos.component';

describe('ModaldetailsosComponent', () => {
  let component: ModaldetailsosComponent;
  let fixture: ComponentFixture<ModaldetailsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldetailsosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldetailsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
