import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleContentComponent } from './collapsible-content.component';

describe('CollapsibleContentComponent', () => {
  let component: CollapsibleContentComponent;
  let fixture: ComponentFixture<CollapsibleContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleContentComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CollapsibleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
