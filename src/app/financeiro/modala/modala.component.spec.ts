import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalaComponent } from './modala.component';

describe('ModalaComponent', () => {
  let component: ModalaComponent;
  let fixture: ComponentFixture<ModalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
