import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable, Subscription } from 'rxjs';
// import { environment } from '../../../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import {
  CaptchaModel,
  CaptchaModelResponse,
  CaptchaRequestData,
  CaptchaResponsePayload,
} from '../models/captcha.model';
import { CaptchaHttpService } from './captcha-http.service';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService implements OnDestroy {
  // private captchaUrl: string = `${environment.apiUrl}/captchaService`;

  private _captchaBS: BehaviorSubject<CaptchaModel> = new BehaviorSubject<CaptchaModel>(
    new CaptchaModel(),
  );
  readonly captcha$: Observable<CaptchaModel> = this._captchaBS.asObservable();

  private currentCaptcha: BehaviorSubject<CaptchaModelResponse> =
    new BehaviorSubject<CaptchaModelResponse>({} as CaptchaModelResponse);

  get currentCaptcha$(): Observable<CaptchaModelResponse> {
    return this.currentCaptcha.asObservable();
  }

  get currentCaptchaValue() {
    return this.currentCaptcha.value;
  }

  private subs: Subscription[] = [];

  constructor(private captchaHttpService: CaptchaHttpService, private toast: ToastrService) {}

  getLatestCaptcha() {
    // const sub = this.http.get(this.captchaUrl).
  }

  async getCaptchaChallenge(width: string = '160', height: string = '80') {
    // // console.log('inside captcha challenge');
    const captchaData: CaptchaModelResponse = await lastValueFrom(
      this.captchaHttpService.getCaptchaChallenge(width, height),
    );
    this.currentCaptcha.next(captchaData);
    // // console.log('captcha response: ', captchaData);

    return captchaData;
  }

  async verifyCaptcha(data: CaptchaRequestData) {
    const currentCaptcha = this.currentCaptcha.getValue();
    // console.log('currentCaptch', currentCaptcha);
    const captchaResponse: CaptchaResponsePayload = await lastValueFrom(
      this.captchaHttpService.verifyCaptcha(data, currentCaptcha.sessionId),
    );
    if (captchaResponse.status === 'SUCCESS') {
      // this.toast.success('Captcha verified successfully', 'Captcha Verified');
      return captchaResponse;
    } else {
      // this.toast.error(captchaResponse.statusDesc, 'Error');
      // await this.getCaptchaChallenge();
      return captchaResponse;
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
