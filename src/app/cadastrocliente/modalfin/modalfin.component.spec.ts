import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalfinComponent } from './modalfin.component';

describe('ModalfinComponent', () => {
  let component: ModalfinComponent;
  let fixture: ComponentFixture<ModalfinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalfinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalfinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
