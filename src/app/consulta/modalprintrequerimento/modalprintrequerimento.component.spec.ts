import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalprintrequerimentoComponent } from './modalprintrequerimento.component';

describe('ModalprintrequerimentoComponent', () => {
  let component: ModalprintrequerimentoComponent;
  let fixture: ComponentFixture<ModalprintrequerimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalprintrequerimentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalprintrequerimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
