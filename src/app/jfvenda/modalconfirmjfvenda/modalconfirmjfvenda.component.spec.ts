import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmjfvendaComponent } from './modalconfirmjfvenda.component';

describe('ModalconfirmjfvendaComponent', () => {
  let component: ModalconfirmjfvendaComponent;
  let fixture: ComponentFixture<ModalconfirmjfvendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmjfvendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmjfvendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
