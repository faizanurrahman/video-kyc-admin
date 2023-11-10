import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideProfileComponent } from './aside-profile.component';

describe('AsideProfileComponent', () => {
  let component: AsideProfileComponent;
  let fixture: ComponentFixture<AsideProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideProfileComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AsideProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
