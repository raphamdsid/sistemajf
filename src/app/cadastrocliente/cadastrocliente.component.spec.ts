import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroclienteComponent } from './cadastrocliente.component';

describe('CadastroclienteComponent', () => {
  let component: CadastroclienteComponent;
  let fixture: ComponentFixture<CadastroclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroclienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
