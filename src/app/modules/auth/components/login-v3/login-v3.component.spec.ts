import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginV3Component } from './login-v3.component';

describe('LoginV3Component', () => {
  let component: LoginV3Component;
  let fixture: ComponentFixture<LoginV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginV3Component],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
