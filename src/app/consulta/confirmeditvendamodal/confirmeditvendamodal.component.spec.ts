import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmeditvendamodalComponent } from './confirmeditvendamodal.component';

describe('ConfirmeditvendamodalComponent', () => {
  let component: ConfirmeditvendamodalComponent;
  let fixture: ComponentFixture<ConfirmeditvendamodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmeditvendamodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmeditvendamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
