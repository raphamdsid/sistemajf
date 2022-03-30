import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrodepComponent } from './cadastrodep.component';

describe('CadastrodepComponent', () => {
  let component: CadastrodepComponent;
  let fixture: ComponentFixture<CadastrodepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrodepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrodepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
