import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalconfirmordemservicoComponent } from './modalconfirmordemservico.component';

describe('ModalconfirmordemservicoComponent', () => {
  let component: ModalconfirmordemservicoComponent;
  let fixture: ComponentFixture<ModalconfirmordemservicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalconfirmordemservicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalconfirmordemservicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
