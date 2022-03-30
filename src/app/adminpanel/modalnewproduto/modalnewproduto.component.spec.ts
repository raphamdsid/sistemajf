import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalnewprodutoComponent } from './modalnewproduto.component';

describe('ModalnewprodutoComponent', () => {
  let component: ModalnewprodutoComponent;
  let fixture: ComponentFixture<ModalnewprodutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalnewprodutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalnewprodutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
