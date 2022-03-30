import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleditprodutoComponent } from './modaleditproduto.component';

describe('ModaleditprodutoComponent', () => {
  let component: ModaleditprodutoComponent;
  let fixture: ComponentFixture<ModaleditprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleditprodutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleditprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
