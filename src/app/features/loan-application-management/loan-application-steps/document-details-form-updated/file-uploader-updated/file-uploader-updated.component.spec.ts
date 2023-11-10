import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderUpdatedComponent } from './file-uploader-updated.component';

describe('FileUploaderUpdatedComponent', () => {
  let component: FileUploaderUpdatedComponent;
  let fixture: ComponentFixture<FileUploaderUpdatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploaderUpdatedComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FileUploaderUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
