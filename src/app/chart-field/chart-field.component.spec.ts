import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFieldComponent } from './chart-field.component';

describe('ChartFieldComponent', () => {
  let component: ChartFieldComponent;
  let fixture: ComponentFixture<ChartFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
