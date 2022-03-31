import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModallaboratorioComponent } from './modallaboratorio.component';

describe('ModallaboratorioComponent', () => {
  let component: ModallaboratorioComponent;
  let fixture: ComponentFixture<ModallaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModallaboratorioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModallaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
