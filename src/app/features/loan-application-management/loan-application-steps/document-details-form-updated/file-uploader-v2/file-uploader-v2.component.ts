import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '@core/services/user-data.service';
import {
  DocFileModel,
  DocumentUploadControlData,
} from '@lam/loan-application-steps/document-details-form-updated/file-upload.model';
import { FileUploadService } from '@lam/loan-application-steps/document-details-form-updated/file-upload.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, map, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-uploader-v2',
  standalone: true,

  templateUrl: './file-uploader-v2.component.html',
  styleUrls: ['./file-uploader-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPopover],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderV2Component),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploaderV2Component),
      multi: true,
    },
  ],
})
export class FileUploaderV2Component
  implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy
{
  private _value: any = null;
  public _disabled: boolean;
  private _required: boolean;

  private _onChange: (_: any) => void;
  private _onTouched: () => void;

  public maxFileSize: any;
  public maxFiles: any;
  public allowedFileTypes: string;

  public allFiles: DocFileModel[] = [];

  public uploadedFiles: DocFileModel[] = [];

  public fileNeedToUpload: DocFileModel[] = [];

  @Input() public formControlName: string;
  @Input() public additionalData: DocumentUploadControlData;

  public fileUploadProgressMap: Map<string, any> = new Map<string, any>();

  // ========user specific data=========
  public userData: any;
  public applicationId: any;
  public sessionId: any;
  public username: any;

  constructor(
    private uploadService: FileUploadService,
    private toast: ToastrService,
    private userDataService: UserDataService,
    private activatedRoute: ActivatedRoute,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) {
    this.userData = this.userDataService.getUserData();
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get('applicationId')!;
    this.sessionId = this.userData.sessionId;
    this.username = this.userData.genericServiceBean.newLoginBean.loginId;
  }

  ngOnInit(): void {
    this.maxFileSize = this.additionalData.maxSize;
    this.maxFiles = this.additionalData.maxFileCount;
    this.allowedFileTypes = this.additionalData.accept;
  }

  ngOnChanges(): void {}

  writeValue(value: any): void {
    this._value = value;

    // // console.log('writeValue', value);
    if (value) {
      if (Array.isArray(value)) {
        this.allFiles = value;
        this.uploadedFiles = value;
      } else if (typeof value === 'object') {
        this.allFiles = [value];
        this.uploadedFiles = [value];
      }
    } else {
      this.allFiles = [];
      this.uploadedFiles = [];
    }

    this.uploadedFiles.forEach((item: DocFileModel, index: number) => {
      this.fileUploadProgressMap.set(item.docName, 100);
    });
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return null;
  }

  public viewUploadedFiles(index: any) {
    const files = this.uploadedFiles[index];
    this.uploadService
      .viewFile(files)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const fileUrl = res.url;

        let splitFilePath = files.docName.split('.');
        let fileType = splitFilePath[splitFilePath.length - 1];
        // let fileType = files.docName.split('.')[1];

        let iconHtml = '';

        if (fileType.toLowerCase() === 'pdf') {
          iconHtml = '<i class="fas fa-file-pdf fs-2x text-light text-hover-secondary"></i>';
          Swal.fire({
            iconHtml: iconHtml,
            title: 'Document Preview',
            backdrop: false,
            width: 'clamp(300px, 80vw, 1000px)',
            scrollbarPadding: false,
            heightAuto: false,
            html: `
          <div id="swal-html " class="d-flex justify-content-center align-items-center w-100 h-100">
            <iframe width="100%"  height="500px" src="${fileUrl}"></iframe>
           </div>

        `,
            customClass: {
              container: 'swal2-custom-container',
              popup: 'swal2-custom-popup',
              htmlContainer: 'swal2-custom-html-container',
              actions: 'swal2-custom-actions',
              confirmButton: 'swal2-custom-confirm-button',
              icon: 'swal2-custom-icon',
              title: 'swal2-custom-title',
              footer: 'swal2-custom-footer',
            },
          });
        } else {
          iconHtml = '<i class="fas fa-file-image fs-2x text-light text-hover-secondary"></i>';
          Swal.fire({
            iconHtml: iconHtml,
            title: 'Document Preview',
            backdrop: false,
            width: 'clamp(300px, 80vw, 1000px)',
            scrollbarPadding: false,
            heightAuto: false,
            html: `
          <div id="swal-html " class="d-flex justify-content-center align-items-center w-100 h-100">
            <img   height="500px" src="${fileUrl}"></iframe>
           </div>

        `,
            customClass: {
              container: 'swal2-custom-container',
              popup: 'swal2-custom-popup',
              htmlContainer: 'swal2-custom-html-container',
              actions: 'swal2-custom-actions',
              confirmButton: 'swal2-custom-confirm-button',
              icon: 'swal2-custom-icon',
              title: 'swal2-custom-title',
              footer: 'swal2-custom-footer',
            },
          });
        }
      });
  }

  public removeUploadedFiles(index: any) {
    this.uploadedFiles.splice(index, 1);
    this.allFiles = this.uploadedFiles;
    this._onChange(this.uploadedFiles);
  }

  public async fileChangeEvent(event: any) {
    if (event.target.files) {
      const fileList: FileList = event.target.files;
      for (let i = 0; i < fileList.length; i++) {
        // if the number of uploaded files is more than the maximum allowed files, display a pop-up alert using the SweetAlert library
        if (this.uploadedFiles.length + this.fileNeedToUpload.length >= this.maxFiles) {
          Swal.fire({
            icon: 'error',
            title: 'Maximum number of files reached',
            text: `You can upload a maximum of ${this.maxFiles} files`,
            showConfirmButton: false,
            timer: 3000,
            heightAuto: false,
          });

          break;
        }

        // if file type is not allowed, display a pop-up alert using the SweetAlert library
        let splitFilePath = fileList[i].name.split('.');
        let fileType = splitFilePath[splitFilePath.length - 1];
        if (!this.allowedFileTypes.includes(fileType)) {
          Swal.fire({
            icon: 'error',
            title: 'File type not allowed',
            text: `You can only upload ${this.allowedFileTypes} files`,
            showConfirmButton: false,
            timer: 3000,
            heightAuto: false,
          });

          break;
        }

        // if file is older than 6 months, display a pop-up alert using the SweetAlert library
        if (this.isOlderThan6Months(fileList[i])) {
          Swal.fire({
            icon: 'error',
            title: 'File is older than 6 months',
            text: 'You can only upload files that are not older than 6 months',
            showConfirmButton: false,
            timer: 2000,
            heightAuto: false,
          });

          continue;
        }

        if (this.uploadedFiles.length + this.fileNeedToUpload.length < this.maxFiles) {
          if (fileList[i].size <= this.maxFileSize) {
            let isExist = false;

            // Check if the file already exists in the list of uploaded files
            // Note: Not implemented yet
            this.uploadedFiles.forEach(async (item: DocFileModel, index: number) => {
              if (item.docName === fileList[i].name) {
                // If a file with the same name already exists, display a pop-up alert using the SweetAlert library
                isExist = true;

                const duplicateFilePopup = await Swal.fire({
                  icon: 'info',
                  title: 'File already exists.',
                  html: `
                    <p>File name: ${fileList[i].name}</p>
                    <p>File size: ${fileList[i].size / 1000} KB</p>
                    <p>File type: ${fileList[i].type}</p>

                    <p> Avoid adding duplicate document, please remove it </p>

                    `,
                  showCancelButton: false,
                  confirmButtonText: 'OK',
                  cancelButtonText: 'No',
                  heightAuto: false,
                });

                if (duplicateFilePopup.isConfirmed) {
                  await Swal.fire({
                    icon: 'error',
                    title: 'Duplicate File Upload Not Allowed',
                    heightAuto: false,
                  });
                } else if (duplicateFilePopup.isDenied) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Duplicate File Upload Not Allowed',
                    heightAuto: false,
                  });
                }
              } else {
              }
            });

            if (!isExist) {
              // Push the files to all files array
              const docFileModel: DocFileModel = {
                id: -1,
                docDescription: this.formControlName,
                docName: fileList[i].name,
                docPath: fileList[i].name,
                docType: this.formControlName,
                docFile: fileList[i],
                applicationId: this.applicationId,
              };

              this.fileNeedToUpload.push(docFileModel);
              this.allFiles = [...this.allFiles, docFileModel];
            }
          } else {
            // If the size of the current file exceeds the maximum limit,
            // display an error message using the SweetAlert library
            Swal.fire({
              icon: 'error',
              title: 'File size exceeds maximum limit.',
              html: `
              <p>Maximum file size allowed is ${this.maxFileSize / 1000} KB.</p>
              <p>Selected file size is ${fileList[i].size / 1000} KB.</p>
              <p>Select another file and try again.</p>
              `,
              showConfirmButton: false,
              heightAuto: false,
              timer: 3500,
            });
          }
        }
      }

      // Upload Each File Selected;

      this.asyncUploadAllFiles()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.uploadedFiles = [...this.uploadedFiles, ...res];
          this.allFiles = [...this.uploadedFiles];

          this.fileNeedToUpload = [];
          this._onChange(this.uploadedFiles);
        });
    }
  }

  public asyncUploadAllFiles() {
    const uploadObservables = this.fileNeedToUpload.map((file: DocFileModel) =>
      this.uploadService.uploadFile(file).pipe(
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentage = Math.round(100 * (event.loaded / event.total!));
            this.fileUploadProgressMap.set(file.docName, percentage);
            // // console.log('progress', percentage);
          } else if (event instanceof HttpResponse) {
            return event.body;
          }
        }),
        catchError((error: any) => {
          this.fileUploadProgressMap.set(file.docName, 0);

          this.toast.error('File Upload Failed', file.docName);

          this.fileNeedToUpload = this.fileNeedToUpload.filter(
            (item) => item.docName !== file.docName,
          );

          return of(undefined);
        }),
      ),
    );

    return forkJoin(uploadObservables).pipe(
      map((responses: any[]) => {
        const successFiles: DocFileModel[] = [];

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          const file = this.fileNeedToUpload[i];

          if (response && response.status === 'SUCCESS') {
            file.id = response.data.fileId;
            this.fileUploadProgressMap.set(file.docName, 100);
            this.toast.success('File Uploaded Successfully', file.docName);
            successFiles.push(file);
          } else {
            this.fileUploadProgressMap.set(file.docName, 0);
          }
        }

        return successFiles;
      }),
    );
  }

  public fileFocusEvent(event: any) {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  public formatSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  ngOnDestroy() {}

  isOlderThan6Months(file: File): boolean {
    const currentDate = new Date();
    const fileDate = new Date(file.lastModified);
    const diffTime = Math.abs(currentDate.getTime() - fileDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // return diffDays > 180;
    return false;
  }
}
