import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstornamodalComponent } from './estornamodal.component';

describe('EstornamodalComponent', () => {
  let component: EstornamodalComponent;
  let fixture: ComponentFixture<EstornamodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstornamodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstornamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
