import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNotificationComponent } from './aside-notification.component';

describe('AsideNotificationComponent', () => {
  let component: AsideNotificationComponent;
  let fixture: ComponentFixture<AsideNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideNotificationComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AsideNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
