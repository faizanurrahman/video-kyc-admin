import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCard3Component } from './offer-card3.component';

describe('OfferCard3Component', () => {
  let component: OfferCard3Component;
  let fixture: ComponentFixture<OfferCard3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCard3Component],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferCard3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
