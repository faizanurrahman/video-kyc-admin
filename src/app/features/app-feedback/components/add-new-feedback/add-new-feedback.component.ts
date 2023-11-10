import { CommonModule, KeyValuePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../../core/services/sweet-alert.service';
import { PopupComponent } from '../../../../_metronic/partials/layout/modals/popup/popup.component';
import { BranchDetailsService } from '../../../loan-application-management/loan-application-steps/application-detail-form/branch-details.service';
import { AppFeedbackService } from '../../services/app-feedback.service';
import { FeedbackDepartmentService } from './feedback-department.service';

@Component({
  selector: 'app-add-new-feedback',
  templateUrl: './add-new-feedback.component.html',
  styleUrls: ['./add-new-feedback.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [FeedbackDepartmentService, BranchDetailsService],
  standalone: true,
  imports: [
    PopupComponent,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgbRating,
    UpperCasePipe,
    KeyValuePipe,
    NgIf,
    CommonModule,
  ],
})
export class AddNewFeedbackComponent implements OnInit {
  @ViewChild('popup') popup: PopupComponent;

  feedback: string = '';
  feedbackForm: FormGroup;
  feedbackDepartments: { [key: string]: string } = {};
  currentRate: number = 0;

  // Feedback word limit ui
  wordCount: any = 0;
  maxWords: any = 2000;

  public branches$: Observable<any>;

  private logger = inject(NGXLogger);
  private branchService = inject(BranchDetailsService);

  constructor(
    private feedbackService: AppFeedbackService,
    private tostr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private feedbackDepartmentService: FeedbackDepartmentService,
    private swalService: SweetAlertService,
    private destroyRef: DestroyRef,
  ) {
    this.feedbackFormInit();
    this.getFeedbackDepartments();
    this.branches$ = this.branchService.getBranchList();
  }

  ngOnInit() {}

  async onSubmitFeedback(formValue: any) {
    const { feedback, department, rating, branchId } = formValue;

    if (feedback.trim().length === 0) {
      this.tostr.info('Feedback should not be empty', 'Feedback Error');
      return;
    }

    await this.feedbackService.addNewFeedback(
      feedback,
      department,
      rating,
      branchId,

      // success response
      () => {
        Swal.fire({
          title: 'Thank You, your feedback has been recorded to CEDA Online successfully!!',
          icon: 'success',
          backdrop: false,
          timerProgressBar: true,
          heightAuto: false,
          timer: 3000,
        }).then((result: any) => {
          if (result.result) {
            // // console.log('ok pressed');
            this.feedback = '';
          } else {
            // // console.log('cancel pressed');
            this.feedback = '';
          }
        });
      },

      // Error Response
      () => {},

      // Finally
      () => {
        this.closeModal();
      },
    );
  }

  public openModal(feedback: string = '') {
    // // console.log('open modal feedback', feedback);
    this.feedback = feedback;

    this.popup
      .open({
        config: {
          container: 'body',
          backdrop: 'static',
          scrollable: true,
          fullscreen: true,
          centered: true,
          backdropClass: 'custom-backdrop',
          windowClass: 'custom-window',
          modalDialogClass: '',
        },
        data: {
          title: 'Add New Feedback',
          showFooter: false,
        },
      })
      .then((result: any) => {});
  }

  public closeModal() {
    this.popup.close().then((r) => {
      // // console.log('popup closed');
      this.feedback = '';
      this.cdr.detectChanges();
    });
  }

  // Feedback Form Initialized
  private feedbackFormInit() {
    this.feedbackForm = this.fb.group(
      {
        feedback: [
          '',
          [Validators.required, Validators.minLength(5), Validators.maxLength(this.maxWords)],
        ],

        department: ['', Validators.required],
        branchId: ['', Validators.required],
        rating: ['', Validators.required],
      },
      { updateOn: 'change' },
    );

    this.feedbackForm
      .get('feedback')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value: any) => {
          // if (value.length > this.maxWords) {
          //   // --- Skip
          // }

          this.wordCount = value?.length || 0;
          // this.cdr.detectChanges();
        },
      });
  }

  private getFeedbackDepartments() {
    this.feedbackDepartmentService.getFeedbackDepartements().subscribe({
      next: (res: any) => {
        this.feedbackDepartments = res;
      },
    });
  }

  public feedbackSubmitted() {
    if (this.feedbackForm.invalid) {
      // this.tostr.error('Enter Feedback and Coressponding Department', 'Feedback Invalid');

      if (this.feedbackForm.get('feedback')?.invalid) {
        const errorMessage = `

  Please enter the feedback message within the following limits:
  - Minimum: 5 characters
  - Maximum: 2000 characters
`;

        this.swalService.error('Feedback Validation Error', errorMessage);
      } else if (this.feedbackForm.get('department')?.invalid) {
        this.swalService.error('Feedback Invalid', 'Please Select the topic');
      } else if (this.feedbackForm.get('rating')?.invalid) {
        this.swalService.error('Feedback Invalid', 'Please choose the rating from 1 to 5');
      } else if (this.feedbackForm.get('branchId')?.invalid) {
        this.swalService.error('Branch Id Missing', 'Please Select The Branch');
      }
      return;
    }

    const formValue = this.feedbackForm.getRawValue();

    this.onSubmitFeedback(formValue).then((r) => this.feedbackForm.reset());
  }

  public ratingChanged(rate: number) {
    this.feedbackForm.get('rating')?.setValue(rate);
  }

  // word meter
  textareaOnChange(event: any) {
    console.log('Event: ', event);
  }
}
