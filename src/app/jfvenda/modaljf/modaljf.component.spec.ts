import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaljfComponent } from './modaljf.component';

describe('ModaljfComponent', () => {
  let component: ModaljfComponent;
  let fixture: ComponentFixture<ModaljfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaljfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaljfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
