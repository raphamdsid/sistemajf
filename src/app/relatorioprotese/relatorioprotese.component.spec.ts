import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioproteseComponent } from './relatorioprotese.component';

describe('RelatorioproteseComponent', () => {
  let component: RelatorioproteseComponent;
  let fixture: ComponentFixture<RelatorioproteseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioproteseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioproteseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
