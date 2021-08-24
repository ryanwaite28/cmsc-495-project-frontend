import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsFragmentComponent } from './alerts-fragment.component';

describe('AlertsFragmentComponent', () => {
  let component: AlertsFragmentComponent;
  let fixture: ComponentFixture<AlertsFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertsFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
