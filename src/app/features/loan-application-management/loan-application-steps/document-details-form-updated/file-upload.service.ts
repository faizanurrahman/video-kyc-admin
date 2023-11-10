import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IbUserModel } from '@auth/models/ib-user.model';
import { UserDataService } from '@core/services/user-data.service';
import { environment } from '@environments/environment';
import { map } from 'rxjs';
import { DocFileModel } from './file-upload.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  baseUrl = environment.apiUrl + '/pfsvc/loan/uploadDoc';
  getDocumentUrl = environment.apiUrl + '/pfsvc/downloadFile';

  userData: IbUserModel;

  constructor(private userDataService: UserDataService, private http: HttpClient) {}

  /**
   * Uploads a document file using HTTP POST to the server.
   * @param doc The DocFileModel object representing the document file to upload
   * @returns An Observable that emits events about the progress of the upload request
   */
  uploadFile(doc: DocFileModel) {
    // Get user data from user data service
    this.userData = this.userDataService.getUserData();

    if (!doc.individualId) {
      doc.individualId = '';
    }

    // Get the File object from the DocFileModel object
    const file = doc.docFile!;

    // Create a new FormData object and append the necessary data to it
    const payloadFormData = new FormData();
    payloadFormData.append('docType', doc.docType); // Document type
    payloadFormData.append('doc', file); // Document file
    payloadFormData.append('fileType', file.name.split('.')[1]); // Document file extension
    payloadFormData.append('applicationId', doc.applicationId!); // ID of associated application
    payloadFormData.append('sessionId', this.userData.sessionId); // Session ID
    payloadFormData.append('username', this.userData.genericServiceBean.newLoginBean.loginId); // Username

    payloadFormData.append('individualId', doc.individualId);

    // If the document ID is -1 (i.e. it's a new document file), set the "field" parameter to an empty string
    // Otherwise, set "field" to the document ID as a string
    if (doc.id === -1) {
      payloadFormData.append('field', '');
    } else {
      payloadFormData.append('field', doc.id.toString());
    }

    // // console.log('document to upload', payloadFormData);

    // Send the POST request to the server with the FormData and options
    return this.http.post(this.baseUrl, payloadFormData, {
      reportProgress: true, // Enable progress tracking for the request
      observe: 'events', // Return an Observable of the request events
    });
  }

  /**
   * Removes a document file from the server using HTTP DELETE.
   * @param doc The DocFileModel object representing the document file to remove
   * @returns An Observable that emits events about the progress of the delete request
   */
  removeFile(doc: DocFileModel) {
    // Get user data from user data service
    this.userData = this.userDataService.getUserData();

    // Send the DELETE request to the server with the document ID as a parameter in the URL
    return this.http.delete(`${this.baseUrl}/${doc.id}`, {
      params: {
        applicationId: doc.applicationId!,
        sessionId: this.userData.sessionId,
        username: this.userData.genericServiceBean.newLoginBean.loginId,
      },
      reportProgress: true, // Enable progress tracking for the request
      observe: 'events', // Return an Observable of the request events
    });
  }

  viewFile(doc: DocFileModel) {
    return this.http
      .get(this.getDocumentUrl + '/' + doc.id, {
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((res: any) => {
          return { url: URL.createObjectURL(res) };
        }),
      );
  }
}
