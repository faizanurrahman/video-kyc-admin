import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideMenuItemComponent } from './aside-menu-item.component';

describe('AsideMenuItemComponent', () => {
  let component: AsideMenuItemComponent;
  let fixture: ComponentFixture<AsideMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideMenuItemComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AsideMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
