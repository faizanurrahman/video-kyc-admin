/* eslint-disable max-len */
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IbUserModel } from '@auth/models/ib-user.model';
import { UserDataService } from '@core/services/user-data.service';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import { map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DocFileModel, DocumentUploadControlData } from '../file-upload.model';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-file-uploader-updated',
  templateUrl: './file-uploader-updated.component.html',
  styleUrls: ['./file-uploader-updated.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderUpdatedComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [NgStyle, NgFor, NgIf],
})
export class FileUploaderUpdatedComponent implements OnInit, OnDestroy, ControlValueAccessor {
  // Document counts
  public addDocsCount = 0;
  // --- APPLICATION DETIALS
  public userData: IbUserModel;
  public applicationId: string;
  public sessionId: string;
  public username: string;

  // -- INPUT OUTPUT

  @Input() documentData: DocumentUploadControlData;
  // @Input() docAdditionalDetails: LoanApplicationDocuments;

  @Output() fileUploadedSuccessfully: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileBrowse', { static: false }) fileBrowseRef: ElementRef;

  public accept: string;
  public maxFiles: number;
  public maxFileSize: number;
  public minFileSize: number;

  // Initialize an empty array to contain files that will be uploaded.
  public filesToUpload: File[] = [];

  // Initialize an empty array to contain files that have been successfully uploaded.
  public uploadedFiles: DocFileModel[] = [];

  // Initialize an empty array to contain all files (including those that have and have not been uploaded).
  public allFiles: DocFileModel[] = [];

  // Initialize an empty Map object to keep track of the upload progress of each file, using the file name as a key and the progress percentage as its value.
  public fileProgressMap: Map<string, number> = new Map();

  public uploading: boolean = false;

  public uploadedDocumentsCount: number = 0;

  // --- Manage Subscription in rxjs

  // ---- LIFE CYCLE HOOKS
  constructor(
    private userDataService: UserDataService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private uploadService: FileUploadService,
    private logger: NGXLogger,
  ) {
    this.userData = this.userDataService.getUserData();
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get('applicationId')!;
    this.sessionId = this.userData.sessionId;
    this.username = this.userData.genericServiceBean.newLoginBean.loginId;
  }

  /**
   * Responds to initialization of this component.
   */
  ngOnInit() {
    // Get the currently uploaded files from the 'data' field of the input 'documentData' object, if it exists.
    // const currentUploadedFiles = this.documentData?.data;

    // Set various properties of this component to the values of corresponding fields in the input 'documentData' object,
    // if they exist.
    this.accept = this.documentData?.accept;
    this.maxFiles = this.documentData?.maxFileCount;
    this.maxFileSize = this.documentData?.maxSize;
    this.minFileSize = this.documentData?.minSize;

    // If the input 'documentData' object has a 'data' field...
    if (this.documentData.data) {
      // If it is an array, set the 'uploadedFiles' property of this component to that array.
      if (Array.isArray(this.documentData.data)) {
        // // console.log('Array of docs', this.documentData);
        this.uploadedFiles = this.documentData.data;
      }
      // If it is not an array, it must be a single item, so add it to the 'uploadedFiles' property as an array containing one item.
      else {
        this.uploadedFiles.push(this.documentData.data);
      }

      this.uploadedDocumentsCount = this.uploadedFiles.length;
    }

    // Note: The following two lines are commented out, so they do not have any effect on the behavior of this function.
    // this.uploadedFiles = this.documentData?.data;
    // this.allFiles = this.documentData?.data;
  }

  /**
   * Responds to changes in input properties on this component.
   * @param changes An object containing the previous and current values of any changed input properties.
   */
  // ngOnChanges(changes: SimpleChanges) {
  //   const { documentData } = changes;

  //   // If the 'documentData' property has been updated with a new value...
  //   if (documentData?.currentValue) {
  //     // console.log('ng on change called', documentData.currentValue);
  //     // Update the local 'documentData' variable to reflect the new value.
  //     this.documentData = documentData.currentValue;
  //     // // console.log('Document Data inside ngOnChange', this.documentData);

  //     // If the 'data' field of the 'documentData' object is defined...
  //     if (this.documentData.data) {
  //       // If it is an array, iterate over its items and add each one to the 'fileProgressMap'
  //       // with a progress value of 100%.
  //       if (Array.isArray(this.documentData.data)) {
  //         this.documentData.data.forEach((item: DocFileModel, index: number) => {
  //           this.fileProgressMap.set(item.docName, 100);
  //           // this.uploadedFiles.push(item);
  //           // // console.log('uploaded files array', this.uploadedFiles);
  //         });
  //         this.uploadedFiles = this.documentData.data;
  //       }
  //       // If it is not an array, it must be a single item, so add it to the 'fileProgressMap'
  //       // with a progress value of 100%.
  //       else {
  //         this.fileProgressMap.set(this.documentData.data.docName, 100);
  //         if (this.uploadedFiles.length === 0) {
  //           this.uploadedFiles.push(this.documentData.data);
  //         }
  //       }
  //     }
  //   }

  //   // if (docAdditionalDetails?.currentValue) {
  //   //   const { fileExtensionType, numberOfDocs, maxUploadSize } =
  //   //     docAdditionalDetails.currentValue;

  //   //   // this.accept = fileExtensionType;
  //   //   // this.maxFiles = numberOfDocs;
  //   //   // this.maxFileSize = maxUploadSize * 1024 * 1024; // in MB
  //   //   // this.minFileSize = 1024; // 1KB
  //   // }
  // }

  ngOnDestroy() {}

  // Functionality
  //
  public viewFile(index: number): void {}

  /**
   * This method allows the user to view uploaded files. It retrieves the URL of the file from uploadService and displays either an image or a PDF using Sweet Alert 2, depending on the file type. The index parameter specifies the index of the file to be viewed, while takeUntil() ensures that the subscription is terminated when the component is destroyed.
   */
  public viewUploadedFiles(index: number): void {
    const files = this.uploadedFiles[index];
    this.uploadService
      .viewFile(files)
      .pipe(takeUntilDestroyed())
      .subscribe((res: any) => {
        const fileUrl = res.url;

        let fileType = files.docName.split('.')[1];

        if (fileType.toLowerCase() !== 'pdf') {
          Swal.fire({
            title: 'Document Preview',
            imageUrl: fileUrl,
            backdrop: false,
            width: 'auto',
            imageHeight: 300,
            imageAlt: 'Document Preview Not available',
            imageWidth: 300,
            heightAuto: false,
            scrollbarPadding: true,
          });
        } else {
          Swal.fire({
            title: 'Document Preview',
            backdrop: false,
            width: 'auto',
            scrollbarPadding: true,
            heightAuto: false,
            html: `<iframe width="100%" height="500px" src="${fileUrl}"></iframe>`,
          });
        }
      });
  }

  /**
   * This method allows the user to view newly uploaded files. It displays a success message using toastr, then uses the Swal library to display either an image or a PDF, depending on the file type. The index parameter specifies the index of the file to be viewed, while URL.createObjectURL() creates a URL for the file to be displayed.
   */
  public viewNewFiles(index: number): void {
    this.toastr.success('view new uploaded document');
    const files = this.filesToUpload[index];
    // type of File

    let fileType = files.name.split('.')[1];
    let fileUrl = URL.createObjectURL(files);

    if (fileType.toLowerCase() !== 'pdf') {
      Swal.fire({
        title: 'Document Preview',
        imageUrl: fileUrl,
        backdrop: false,
        width: 'auto',
        imageHeight: 300,
        imageAlt: 'Document Preview',
        imageWidth: 300,
        heightAuto: false,
        scrollbarPadding: true,
      });
    } else {
      Swal.fire({
        title: 'Document Preview',
        backdrop: false,
        heightAuto: false,

        scrollbarPadding: true,
        html: `<iframe width="100%"  height="100%" src="${fileUrl}"></iframe>`,
        grow: 'row',
      });
    }
  }

  public removeFile(index: number): void {
    this.toastr.success('remove file not implemented');
  }

  public removeUploadedFiles(index: number) {
    // this.toastr.info('uploaded file remove not implemented', 'Comming Soon');
    // this.uploadService.removeFile(this.)
    // todo: Important on priority need to fixed
    this.uploadedFiles.splice(index, 1);

    // todo: need to inform parent element to check validity
  }

  public removeNewFiles(index: number): void {
    // this.toastr.error('remove new file');
    this.filesToUpload.splice(index, 1);
  }

  /**
   * Function to upload a file to the server.
   * @param index - The index of the file in array named "filesToUpload".
   */
  public uploadFile(index: number): void {
    // Get the ith file from an array named 'filesToUpload'.

    // // console.log('files to upload', this.filesToUpload);

    const file = this.filesToUpload[index];

    // Create an object of class DocFileModel to set values for properties.
    const convertedFile: DocFileModel = {
      id: -1,
      docDescription: this.documentData?.name,
      docPath: file.name,
      docName: file.name,
      docType: this.documentData?.formControlName,
      docFile: file,
      applicationId: this.applicationId,
    };

    // // console.log('converted files to upload', convertedFile);

    // Call an external service named uploadService and subscribe to its output using pipe and then subscribe function.
    this.uploadService
      .uploadFile(convertedFile)
      .pipe(
        // Unsubscribe from the observable when component is destroyed to prevent memory leak.
        takeUntilDestroyed(),
        map((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentage = Math.round(100 * (event.loaded / event.total!));
            // // console.log('percentage', percentage);

            // Update the progress percentage of upload.
            this.fileProgressMap.set(file.name, percentage);
            return of(undefined);
          } else if (event instanceof HttpResponse) {
            this.uploading = false;

            return event.body;
          }

          // fix: need to decide where this body will goes
          // return event.body;
        }),
      )
      .subscribe((response: any) => {
        // On successful completion, update necessary changes

        // Set uploading status to false
        this.uploading = false;

        // Check if response exists
        if (response) {
          // // console.log('response came from backend on upload document', response);
          if (response.status === 'SUCCESS') {
            // Displaying a success message using toastr library
            this.toastr.success('File Uploaded Successfully', file.name);

            // Updating the id of file
            convertedFile.id = response.data.fileId;

            // Setting progress percentage to 100 upon successful upload
            this.fileProgressMap.set(file.name, 100);

            // Removing the uploaded file from array named "filesToUpload"
            this.filesToUpload.splice(index, 1);

            // // console.log('files to upload after remove', this.filesToUpload);

            // Adding the uploaded file in array named "uploadedFiles"
            this.uploadedFiles.push(convertedFile);

            this.uploadedDocumentsCount = this.uploadedFiles.length;

            this.fileUploadedSuccessfully.emit(convertedFile);
          }

          if (response.status === 'FAILED') {
            // Logging the response
            this.logger.log('response failed', response);

            // Setting the progress percentage to 0 since upload failed
            this.fileProgressMap.set(file.name, 0);

            // Displaying an error message using SweetAlert library
            Swal.fire({
              title: 'Upload Failed',
              text: 'Unable to upload document, try again!',
              timer: 2000,
              heightAuto: false,
            });
          }
        }

        // fix: need to do with file id
      });
  }

  public uploadAllFiles(): void {
    this.toastr.success('upload all documented not implemented');
  }

  public removeAllFiles(): void {
    this.toastr.success('remove all file not implemented');
  }

  // ============== Custom Form control implementation ====================

  // Initialize the 'onTouchCallback' property of this component to a function that logs the name of this form control (if available) when it is touched.
  public onTouchCallback: () => void = () => {
    // // console.log(this.documentData?.formControlName, ' is touched');
  };

  // Initialize the 'onChangeCallback' property of this component to a function that logs the name of this form control (if available) when its value changes.
  public onChangeCallback: () => void = () => {
    // // console.log(this.documentData?.formControlName, ' is changed');
  };

  // Initialize the '_disabled' property of this component to false.
  public _disabled: boolean = false;

  /**
   * Sets the value of this form control based on an external object.
   * @param obj The object to use as the new value for this form control.
   */
  writeValue(obj: any): void {
    // This function is currently empty except for a commented-out // console.log statement.
  }

  /**
   * Registers a callback function to be called whenever the value of this form control changes.
   * @param fn The callback function to register.
   */
  registerOnChange(fn: any): void {
    // Set the 'onChangeCallback' property of this component to the given callback function.
    this.onChangeCallback = fn;
  }

  /**
   * Registers a callback function to be called whenever this form control is "touched" (i.e. interacted with in some way).
   * @param fn The callback function to register.
   */
  registerOnTouched(fn: any): void {
    // Set the 'onTouchCallback' property of this component to the given callback function.
    this.onTouchCallback = fn;
  }

  /**
   * Sets whether or not this form control should be disabled.
   * @param isDisabled Whether or not this form control should be disabled.
   */
  setDisabledState?(isDisabled: boolean): void {
    // Set the '_disabled' property of this component to the given 'isDisabled' value.
    this._disabled = isDisabled;
    // Log the current and newly set disabled state, but this line is commented out so it does not have any effect on the behavior of this function.
    // // console.log('is disabled', this._disabled, isDisabled);
  }

  // --- Helper Function

  public uploadFileToServer(fileData: DocFileModel) {
    this.toastr.success('need to implement', '');
  }

  public fileSelected(event: any): void {
    if (event.target.files) {
      const fileList: FileList = event.target.files;
      for (let i = 0; i < fileList.length; i++) {
        // if the number of uploaded files is more than the maximum allowed files, display a pop-up alert using the SweetAlert library
        if (this.uploadedFiles.length + this.filesToUpload.length >= this.maxFiles) {
          Swal.fire({
            icon: 'error',
            title: 'Maximum number of files reached',
            text: `You can upload a maximum of ${this.maxFiles} files`,
            showConfirmButton: false,
            timer: 2000,
            heightAuto: false,
          });
          continue;
        }

        if (this.uploadedFiles.length + this.filesToUpload.length < this.maxFiles) {
          if (fileList[i].size <= this.maxFileSize) {
            // Creates a boolean flag to keep track of whether or not a file with the same name already exists
            let isExist = false;

            // Loops through each uploaded file
            this.uploadedFiles.forEach(async (item: DocFileModel, index: number) => {
              if (item.docName === fileList[i].name) {
                // If a file with the same name already exists, display a pop-up alert using the SweetAlert library
                isExist = true;

                const duplicateFilePopup = await Swal.fire({
                  icon: 'info',
                  title: 'File already exists.',
                  heightAuto: false,
                  html: `
                    <p>File name: ${fileList[i].name}</p>
                    <p>File size: ${fileList[i].size / 1000} KB</p>
                    <p>File type: ${fileList[i].type}</p>

                    <p> Avoid adding duplicate document, please remove it </p>

                    `,
                  showCancelButton: false,
                  confirmButtonText: 'OK',
                  cancelButtonText: 'No',
                });

                if (duplicateFilePopup.isConfirmed) {
                  // If the user confirms the pop up, remove the existing file and add the new one to the filesToUpload array

                  const documentId = item.id;
                  await this.uploadService.removeFile(item);
                  item.id = documentId;
                } else if (duplicateFilePopup.isDenied) {
                  // If the user denies the pop up, ignore the newly uploaded file
                  this.toastr.info(item.docName + ' file is ignored', 'File Ignored');
                }
              }
            });

            // If no existing file was found with the same name, add the new file to the filesToUpload array
            if (!isExist) {
              this.filesToUpload.push(fileList[i]);
            }
          } else {
            // If the size of the current file exceeds the maximum limit,
            // display an error message using the SweetAlert library
            Swal.fire({
              icon: 'error',
              title: 'File size exceeds maximum limit.',
              heightAuto: false,
              html: `
              <p>Maximum file size allowed is ${this.maxFileSize / 1000} KB.</p>
              <p>Selected file size is ${fileList[i].size / 1000} KB.</p>
              <p>Select another file and try again.</p>
              `,
              showConfirmButton: false,
              timer: 3500,
            });
          }
        }

        // else {
        //   // alert('Maximum number of files exceeded.');
        //   Swal.fire({
        //     icon: 'info',
        //     title: 'Maximum number of files exceeded.',
        //     html: `
        //     <p>Maximum number of files allowed is ${this.maxFiles}.</p>
        //     `,
        //     showConfirmButton: false,
        //     timer: 3500,
        //   });
        // }
      }

      // Upload Each File Selected;

      this.filesToUpload.forEach((file: any, i: number) => {
        this.uploadFile(i);
      });

      // this.onChangeCallback(this.files);
      // this.onChangeCallback();
      this.onTouchCallback();
    }
  }

  /**
   * Formats a given number of bytes as a string with an appropriate unit (Bytes, KB, MB, etc.).
   * @param bytes The number of bytes to format.
   * @returns A string representing the formatted size.
   */
  public formatSize(bytes: number): string {
    // If the input is 0, return the string '0 Bytes' immediately.
    if (bytes === 0) {
      return '0 Bytes';
    }
    // Define an array of unit sizes in descending order (largest to smallest).
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // Calculate the exponent needed to convert from bytes to the largest possible unit
    // such that the result is greater than or equal to 1.
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    // Divide the input by the appropriate power of 1024 and round to 2 decimal places using toFixed().
    // Concatenate the resulting number and its corresponding unit into a single string (e.g. "1.23 MB").
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
}
