import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalfpagComponent } from './modalfpag.component';

describe('ModalfpagComponent', () => {
  let component: ModalfpagComponent;
  let fixture: ComponentFixture<ModalfpagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalfpagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalfpagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
