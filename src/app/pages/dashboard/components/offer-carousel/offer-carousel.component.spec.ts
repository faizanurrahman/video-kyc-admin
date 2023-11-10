import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCarouselComponent } from './offer-carousel.component';

describe('OfferCarouselComponent', () => {
  let component: OfferCarouselComponent;
  let fixture: ComponentFixture<OfferCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCarouselComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OfferCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
