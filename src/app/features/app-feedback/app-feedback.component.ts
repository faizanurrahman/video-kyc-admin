import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { HttpLoaderService } from '../../core/services/http-loader.service';
import { PopupComponent } from '../../_metronic/partials/layout/modals/popup/popup.component';
import { AddNewFeedbackComponent } from './components/add-new-feedback/add-new-feedback.component';
import { FeedbackDepartmentService } from './components/add-new-feedback/feedback-department.service';
import { FeedbackData } from './models/feedback-response-bean.model';
import { AppFeedbackService } from './services/app-feedback.service';
import { FormatDatePipe } from './utils/format-date.pipe';

// Ikiya - swedan

@Component({
  selector: 'app-app-feedback',
  templateUrl: './app-feedback.component.html',
  styleUrls: ['./app-feedback.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  viewProviders: [AddNewFeedbackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'app-feedback',
  providers: [FeedbackDepartmentService],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbTooltip,
    AddNewFeedbackComponent,
    PopupComponent,
    AsyncPipe,
    FormatDatePipe,
    DatePipe,
  ],
})
export class AppFeedbackComponent implements OnDestroy {
  @ViewChild(AddNewFeedbackComponent, { static: true })
  addNewFeedbackComponent: AddNewFeedbackComponent;

  @ViewChild('previewFeedback') previewFeedbackPopup: PopupComponent;

  public currentFeedback: string = '';
  public currentResponse: string = '';

  allFeedbacks$: Observable<FeedbackData>;
  departments: { [key: string]: string } = {};

  constructor(
    private feedbackService: AppFeedbackService,
    // private modalService: NgbModal,
    public loader: HttpLoaderService,
    private feedbackDepartmentService: FeedbackDepartmentService,
    private destroyRef: DestroyRef,
    private http: HttpClient,
  ) {
    this.allFeedbacks$ = this.feedbackService.appFeedbacks$;

    this.feedbackDepartmentService
      .getFeedbackDepartements()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.departments = res;
      });
  }

  public openFeedbackModal(feedback: any = '') {
    // thi s.modalService.open(AddNewFeedbackComponent, { size: 'lg' });
    this.addNewFeedbackComponent.openModal(feedback);
    // // console.log('open feedback modal');
  }

  public openFeedbackMessage(feedbackData: any) {
    this.currentFeedback = feedbackData[0].msg;

    this.currentResponse = !!feedbackData[1] ? feedbackData[1].msg : 'Not Available';
    this.previewFeedbackPopup
      .open({
        config: {
          centered: true,
          scrollable: true,
        },
        data: {
          title: '',
          showFooter: false,
          showHeader: false,
        },
        // eslint-disable-next-line no-undef
      })
      .then((r) => ''); // // console.log(r));
  }

  public deleteFeedback(feedbackId: number) {
    // // console.log('delete feedback');
  }

  public openFeedbackResponse() {}

  ngOnDestroy() {}
}
