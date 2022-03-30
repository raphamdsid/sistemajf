import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmwaitestornoespecialComponent } from './modalconfirmwaitestornoespecial.component';

describe('ModalconfirmwaitestornoespecialComponent', () => {
  let component: ModalconfirmwaitestornoespecialComponent;
  let fixture: ComponentFixture<ModalconfirmwaitestornoespecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmwaitestornoespecialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmwaitestornoespecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
