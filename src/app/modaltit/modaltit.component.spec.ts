import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltitComponent } from './modaltit.component';

describe('ModaltitComponent', () => {
  let component: ModaltitComponent;
  let fixture: ComponentFixture<ModaltitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaltitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
