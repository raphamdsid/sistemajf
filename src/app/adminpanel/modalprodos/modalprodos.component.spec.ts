import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalprodosComponent } from './modalprodos.component';

describe('ModalprodosComponent', () => {
  let component: ModalprodosComponent;
  let fixture: ComponentFixture<ModalprodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalprodosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalprodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
