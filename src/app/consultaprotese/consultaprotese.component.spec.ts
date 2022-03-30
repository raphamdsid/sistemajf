import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaproteseComponent } from './consultaprotese.component';

describe('ConsultaproteseComponent', () => {
  let component: ConsultaproteseComponent;
  let fixture: ComponentFixture<ConsultaproteseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaproteseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaproteseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
