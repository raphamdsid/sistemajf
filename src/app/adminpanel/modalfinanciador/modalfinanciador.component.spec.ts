import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalfinanciadorComponent } from './modalfinanciador.component';

describe('ModalfinanciadorComponent', () => {
  let component: ModalfinanciadorComponent;
  let fixture: ComponentFixture<ModalfinanciadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalfinanciadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalfinanciadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
