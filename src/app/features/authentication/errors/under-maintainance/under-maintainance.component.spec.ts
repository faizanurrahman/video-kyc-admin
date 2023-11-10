import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderMaintainanceComponent } from './under-maintainance.component';

describe('UnderMaintainanceComponent', () => {
  let component: UnderMaintainanceComponent;
  let fixture: ComponentFixture<UnderMaintainanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnderMaintainanceComponent]
    });
    fixture = TestBed.createComponent(UnderMaintainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
