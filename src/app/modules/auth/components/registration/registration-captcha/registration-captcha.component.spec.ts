import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCaptchaComponent } from './registration-captcha.component';

describe('RegistrationCaptchaComponent', () => {
  let component: RegistrationCaptchaComponent;
  let fixture: ComponentFixture<RegistrationCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationCaptchaComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegistrationCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
