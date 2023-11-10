/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserDataService } from '../../../core/services/user-data.service';
import {
  CreateFeedbackResponseBean,
  GetFeedbackResponseBean,
} from '../models/feedback-response-bean.model';

import { FeedbackRequestBean } from '../models/feedback-request-bean.model';

@Injectable({
  providedIn: 'root',
})
export class AppFeedbackHttpService {
  private appGetFeedbackUrl = environment.apiUrl + '/pfsvc/getFeedback';
  private appPostFeedbackUrl = environment.apiUrl + '/pfsvc/addFeedback';

  constructor(private http: HttpClient, private userDataService: UserDataService) {}

  // Get All Feedback
  getAllFeedback() {
    const userData = this.userDataService.getUserData();

    // const loginId = userData.genericServiceBean.newLoginBean.loginId;
    const loginId = 'zahid';
    const sessionId = userData.sessionId;
    const transactionId = '123';

    const requestBean = new FeedbackRequestBean();
    requestBean.newLoginBean = {
      loginId: loginId,
      transactionId: transactionId,
    };

    requestBean.requestId = '123';
    requestBean.serviceName = 'IB_GET_FEEDBACK';
    requestBean.sessionId = sessionId;

    requestBean.data = {
      FEEDBACK_CATEGORY: 'ENQUIRY',
      FEEDBACK_MSG: 'new feedback',
    };

    return this.http.post(
      this.appGetFeedbackUrl,
      requestBean,
    ) as Observable<GetFeedbackResponseBean>;
  }

  postFeedback(feedback: string, department: string, rating: string, branchId: any) {
    const userData = this.userDataService.getUserData();

    const loginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;
    const transactionId = '123';

    const requestBean = new FeedbackRequestBean();
    requestBean.newLoginBean = {
      loginId: loginId,
      transactionId: transactionId,
    };

    requestBean.requestId = '123';
    requestBean.serviceName = 'IB_ADD_FEEDBACK';
    requestBean.sessionId = sessionId;

    requestBean.data.FEEDBACK_CATEGORY = 'ENQUIRY';
    requestBean.data.FEEDBACK_MSG = feedback;
    requestBean.data.BRANCH_ID = department;
    requestBean.data.RATING = rating;
    requestBean.data.ACTUAL_BRANCH_ID = branchId;

    return this.http.post(
      this.appPostFeedbackUrl,
      requestBean,
    ) as Observable<CreateFeedbackResponseBean>;
  }
}
