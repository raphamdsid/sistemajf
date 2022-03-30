import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfigComponent } from './modalconfig.component';

describe('ModalconfigComponent', () => {
  let component: ModalconfigComponent;
  let fixture: ComponentFixture<ModalconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
