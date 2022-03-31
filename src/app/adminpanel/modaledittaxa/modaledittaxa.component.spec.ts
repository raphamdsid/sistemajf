import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaledittaxaComponent } from './modaledittaxa.component';

describe('ModaledittaxaComponent', () => {
  let component: ModaledittaxaComponent;
  let fixture: ComponentFixture<ModaledittaxaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaledittaxaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaledittaxaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
