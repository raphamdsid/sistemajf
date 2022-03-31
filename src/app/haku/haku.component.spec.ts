import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HakuComponent } from './haku.component';

describe('HakuComponent', () => {
  let component: HakuComponent;
  let fixture: ComponentFixture<HakuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HakuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HakuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
