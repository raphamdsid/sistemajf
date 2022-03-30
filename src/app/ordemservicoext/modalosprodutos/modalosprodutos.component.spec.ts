import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalosprodutosComponent } from './modalosprodutos.component';

describe('ModalosprodutosComponent', () => {
  let component: ModalosprodutosComponent;
  let fixture: ComponentFixture<ModalosprodutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalosprodutosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalosprodutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
