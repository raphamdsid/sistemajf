import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldelprodutoComponent } from './modaldelproduto.component';

describe('ModaldelprodutoComponent', () => {
  let component: ModaldelprodutoComponent;
  let fixture: ComponentFixture<ModaldelprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldelprodutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldelprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
