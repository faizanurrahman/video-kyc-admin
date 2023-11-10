import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-loan-payment-callback',
  templateUrl: './loan-payment-callback.component.html',
  styleUrls: ['./loan-payment-callback.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class LoanPaymentCallbackComponent implements OnInit, OnDestroy {
  // subs: Subscription[];
  requestId: any;
  response: any;

  constructor(
    // private loanPaymentService: LoanPaymentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    // this.loanPaymentService.handleCallback();
    this.activatedRoute.url
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: UrlSegment[]) => {
        // // console.log('activated res: ', res);
        this.requestId = res[1].path;
        this.response = res[2].path;

        if (this.response === '1') {
          this.router
            .navigate(['feature/loan-payment/response/success'], {
              queryParams: {
                requestId: this.requestId,
              },
            })
            .then();
        } else {
          this.router.navigate(['feature/loan-payment/response/failure'], {
            queryParams: {
              requestId: this.requestId,
            },
          });
        }
      });
  }

  ngOnDestroy(): void {}
}
