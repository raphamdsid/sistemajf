import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmwaitdescontoComponent } from './modalconfirmwaitdesconto.component';

describe('ModalconfirmwaitdescontoComponent', () => {
  let component: ModalconfirmwaitdescontoComponent;
  let fixture: ComponentFixture<ModalconfirmwaitdescontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmwaitdescontoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmwaitdescontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
