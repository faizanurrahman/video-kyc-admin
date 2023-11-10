/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DoCheck,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoanApplicationModel } from '../../../../features/loan-application-management/models/loan-application.model';
import { LoanApplicationService } from '../../../../features/loan-application-management/services/loan-application.service';
import { LoanApplicationEffectService } from '../../../../features/loan-application-management/state-management/loan-application-effect.service';
import { LoanApplicationStateManagementService } from '../../../../features/loan-application-management/state-management/loan-application-state-management.service';
import { PlayButtonPrimaryComponent } from '../../../../shared/ui/components/buttons/play-button-primary/play-button-primary.component';
import { LoaderComponent } from '../../../../shared/ui/components/loader/loader.component';

@Component({
  selector: 'app-resume-application',
  templateUrl: './resume-application.component.html',
  styleUrls: ['./resume-application.component.scss'],
  standalone: true,
  imports: [InlineSVGModule, FormsModule, NgFor, NgIf, PlayButtonPrimaryComponent, LoaderComponent],
})
export class ResumeApplicationComponent implements OnInit, DoCheck {
  @Input() bgColor: string = '';
  @Input() minWith: string = '250px';
  @HostBinding('class') classes = 'd-flex flex-column  bg-light-danger h-100';
  @HostBinding('style') style = '';

  availableLoanApplications: LoanApplicationModel[] = [];
  selectedLoanApplicationId: string = '';
  selectedLoanApplication: LoanApplicationModel | undefined;

  loading = false;

  ngDoCheck() {}

  constructor(
    private loanApplicationService: LoanApplicationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private loanApplicationStateManagementService: LoanApplicationStateManagementService,
    private loanApplicationEffectService: LoanApplicationEffectService,
  ) {
    this.loanApplicationService
      .getAllLoanApplication()
      // this.loanApplicationStateManagementService.allLoanApplication$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.availableLoanApplications = res?.data?.applications || [];
        this.availableLoanApplications = this.availableLoanApplications.filter((item, index) => {
          if (item.status !== 'SUBMITTED') {
            return true;
          } else {
            return false;
          }
        });

        this.availableLoanApplications = this.availableLoanApplications.reverse();

        // change detection
        // this.cdr.detectChanges();
      });
  }

  onSelectionChange(event: any) {
    // // console.log('event: ', event);
    // // console.log('selectedLoanApplication: ', this.selectedLoanApplication);

    this.selectedLoanApplication = this.availableLoanApplications.find(
      (loanApplication) => loanApplication.applicationId === this.selectedLoanApplicationId,
    );

    // // console.log('selectedLoanApplication: ', this.selectedLoanApplication);
  }

  togglePlayButton() {
    this.loading = !this.loading;

    setTimeout(() => {
      this.loading = !this.loading;

      let url = '/loan-application-management/init';
      let loanType = this.selectedLoanApplication?.loanApplicationType;
      if (loanType === 'mabogoDinku' || loanType === 'mabogodinku' || loanType === 'Mabogo Dinku') {
        url = '/loan-application-management/mabogo-dinku-init';
      }

      this.router.navigate([url], {
        queryParams: {
          loanType: this.selectedLoanApplication?.loanApplicationType,
          applicationId: this.selectedLoanApplication?.applicationId,
          sectorType: this.selectedLoanApplication?.sectorType,
          productType: this.selectedLoanApplication?.productType,
          loanApplicationSapAppStatus: this.selectedLoanApplication?.sapAppStatus,
          currentStep: 1,
        },
      });
    }, 1000);
  }

  ngOnInit(): void {
    if (this.bgColor.startsWith('bg-', 0)) {
      this.classes += ` ${this.bgColor}`;
    } else {
      this.style += ` background-color: \"${this.bgColor}\"`;
    }

    this.style += ` min-width: ${this.minWith}`;
  }

  ngOnDestroy() {}
}
