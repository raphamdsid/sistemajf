import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalentradaComponent } from './modalentrada.component';

describe('ModalentradaComponent', () => {
  let component: ModalentradaComponent;
  let fixture: ComponentFixture<ModalentradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalentradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalentradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
