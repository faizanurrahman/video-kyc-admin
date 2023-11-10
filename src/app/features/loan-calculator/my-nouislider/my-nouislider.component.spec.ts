import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNouisliderComponent } from './my-nouislider.component';

describe('MyNouisliderComponent', () => {
  let component: MyNouisliderComponent;
  let fixture: ComponentFixture<MyNouisliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNouisliderComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyNouisliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
