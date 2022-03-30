import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldetailsjfComponent } from './modaldetailsjf.component';

describe('ModaldetailsjfComponent', () => {
  let component: ModaldetailsjfComponent;
  let fixture: ComponentFixture<ModaldetailsjfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldetailsjfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldetailsjfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
