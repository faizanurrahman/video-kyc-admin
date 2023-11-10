import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCard2Component } from './offer-card2.component';

describe('OfferCard2Component', () => {
  let component: OfferCard2Component;
  let fixture: ComponentFixture<OfferCard2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCard2Component],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
