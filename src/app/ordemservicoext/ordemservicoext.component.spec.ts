import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemservicoextComponent } from './ordemservicoext.component';

describe('OrdemservicoextComponent', () => {
  let component: OrdemservicoextComponent;
  let fixture: ComponentFixture<OrdemservicoextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdemservicoextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdemservicoextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
