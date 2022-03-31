import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleditosComponent } from './modaleditos.component';

describe('ModaleditosComponent', () => {
  let component: ModaleditosComponent;
  let fixture: ComponentFixture<ModaleditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleditosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
