import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalprodlistComponent } from './modalprodlist.component';

describe('ModalprodlistComponent', () => {
  let component: ModalprodlistComponent;
  let fixture: ComponentFixture<ModalprodlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalprodlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalprodlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
