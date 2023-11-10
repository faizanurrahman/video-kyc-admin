import { DestroyRef, Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map } from 'rxjs';
import {
  CreateFeedbackResponseBean,
  FeedbackData,
  GetFeedbackResponseBean,
} from '../models/feedback-response-bean.model';
import { AppFeedbackHttpService } from './app-feedback.http.service';

@Injectable({
  providedIn: 'root',
})
export class AppFeedbackService implements OnDestroy {
  // private subs: Subscription[] = [];

  private appFeedbacks: BehaviorSubject<FeedbackData> = new BehaviorSubject<FeedbackData>(
    {} as FeedbackData,
  );

  get appFeedbacks$() {
    return this.appFeedbacks.asObservable();
  }

  constructor(
    private feedbackHttpService: AppFeedbackHttpService, // private toastr: ToastrService
    private destroyRef: DestroyRef,
  ) {
    this.getAllFeedbacks();
  }

  ngOnDestroy() {}

  // Get All Feedback and update store

  public getAllFeedbacks() {
    this.feedbackHttpService
      .getAllFeedback()
      .pipe(
        map((feedbackResponse: GetFeedbackResponseBean) => {
          return feedbackResponse.data;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: FeedbackData) => {
        this.appFeedbacks.next(res);
      });
  }

  public addNewFeedback(
    message: string,
    department: string,
    rating: string,
    branchId: any,
    successResponse: () => void = () => {},
    failureResponse: () => void = () => {},
    finallyResponse: () => void = () => {},
  ) {
    this.feedbackHttpService
      .postFeedback(message, department, rating, branchId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: CreateFeedbackResponseBean) => {
        if (res.status === 'SUCCESS') {
          successResponse();
        } else if (res.status === 'FAILED') {
          failureResponse();
        }

        this.getAllFeedbacks();
        finallyResponse();
      });
  }
}
