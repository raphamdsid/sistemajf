import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalemergencialComponent } from './modalemergencial.component';

describe('ModalemergencialComponent', () => {
  let component: ModalemergencialComponent;
  let fixture: ComponentFixture<ModalemergencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalemergencialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalemergencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
