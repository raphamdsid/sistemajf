import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrotypeComponent } from './cadastrotype.component';

describe('CadastrotypeComponent', () => {
  let component: CadastrotypeComponent;
  let fixture: ComponentFixture<CadastrotypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrotypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrotypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
