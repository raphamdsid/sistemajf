import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmdescontoComponent } from './modalconfirmdesconto.component';

describe('ModalconfirmdescontoComponent', () => {
  let component: ModalconfirmdescontoComponent;
  let fixture: ComponentFixture<ModalconfirmdescontoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmdescontoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmdescontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
