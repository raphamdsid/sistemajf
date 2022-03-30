import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalunidadeComponent } from './modalunidade.component';

describe('ModalunidadeComponent', () => {
  let component: ModalunidadeComponent;
  let fixture: ComponentFixture<ModalunidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalunidadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalunidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
