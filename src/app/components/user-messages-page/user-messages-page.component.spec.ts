import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessagesPageComponent } from './user-messages-page.component';

describe('UserMessagesPageComponent', () => {
  let component: UserMessagesPageComponent;
  let fixture: ComponentFixture<UserMessagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMessagesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMessagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
