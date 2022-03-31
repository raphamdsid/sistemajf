import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalfornecedoresComponent } from './modalfornecedores.component';

describe('ModalfornecedoresComponent', () => {
  let component: ModalfornecedoresComponent;
  let fixture: ComponentFixture<ModalfornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalfornecedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalfornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
