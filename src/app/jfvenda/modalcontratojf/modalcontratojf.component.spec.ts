import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcontratojfComponent } from './modalcontratojf.component';

describe('ModalcontratojfComponent', () => {
  let component: ModalcontratojfComponent;
  let fixture: ComponentFixture<ModalcontratojfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalcontratojfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalcontratojfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
