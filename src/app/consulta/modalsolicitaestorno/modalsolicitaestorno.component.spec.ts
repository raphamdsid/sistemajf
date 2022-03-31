import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsolicitaestornoComponent } from './modalsolicitaestorno.component';

describe('ModalsolicitaestornoComponent', () => {
  let component: ModalsolicitaestornoComponent;
  let fixture: ComponentFixture<ModalsolicitaestornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalsolicitaestornoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalsolicitaestornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
