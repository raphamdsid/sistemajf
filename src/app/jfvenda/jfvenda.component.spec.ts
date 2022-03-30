import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JfvendaComponent } from './jfvenda.component';

describe('JfvendaComponent', () => {
  let component: JfvendaComponent;
  let fixture: ComponentFixture<JfvendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JfvendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JfvendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
