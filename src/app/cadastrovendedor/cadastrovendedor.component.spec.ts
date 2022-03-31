import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrovendedorComponent } from './cadastrovendedor.component';

describe('CadastrovendedorComponent', () => {
  let component: CadastrovendedorComponent;
  let fixture: ComponentFixture<CadastrovendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrovendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrovendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
