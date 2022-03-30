import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalupdateosComponent } from './modalupdateos.component';

describe('ModalupdateosComponent', () => {
  let component: ModalupdateosComponent;
  let fixture: ComponentFixture<ModalupdateosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalupdateosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalupdateosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
