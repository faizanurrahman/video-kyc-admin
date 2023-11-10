import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from '@shared/utils/custom-validators';
import { NGXLogger } from 'ngx-logger';
import { catchError, Observable, of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserDataService } from '../../../../../../core/services/user-data.service';
import { AuthService } from '../../../../../../modules/auth';
import { IbUserModel } from '../../../../../../modules/auth/models/ib-user.model';
import { TranslationService } from '../../../../../../modules/i18n';
import { ChangePasswordService } from '../../../../../../shared/change-password/change-password.service';
import { PopupComponent } from '../../../modals/popup/popup.component';
import { InitialsPipe } from './initials.pipe';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
  styleUrls: ['./user-inner.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgbTooltip,
    NgFor,
    NgClass,
    PopupComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    InitialsPipe,
  ],
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class =
    'menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  @ViewChild('changePasswordFormPopup') changePasswordFormPopup: PopupComponent;
  @ViewChild('passwordChanged') passwordChanged: PopupComponent;
  @ViewChild('passwordChangeFailed') passwordChangeFailed: PopupComponent;

  public changePasswordForm: FormGroup;
  public isLoading = false;

  language: LanguageFlag;
  user$: Observable<IbUserModel>;
  langs = languages;
  private unsubscribe: Subscription[] = [];
  private readonly logger = inject(NGXLogger);

  constructor(
    private auth: AuthService,
    private translationService: TranslationService,
    private _toastr: ToastrService,
    private ngZone: NgZone,
    private _cdr: ChangeDetectorRef,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private destroyRef: DestroyRef,
  ) {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl(null, [Validators.required]),
        newPassword: new FormControl(null, [
          Validators.required,
          CustomValidators.passwordValidator,
        ]),
        reNewPassword: new FormControl(null, [
          Validators.required,
          CustomValidators.passwordValidator,
        ]),
      },
      {
        updateOn: 'change',
        validators: [
          // this.mustBeDifferent(),
          this.MustMatch('currentPassword', 'newPassword', 'reNewPassword'),
        ],
      },
    );

    // this.changePasswordForm = this.fb.group(
    //   {
    //     currentPassword: [null, [Validators.required]],
    //     newPassword: [null, [Validators.required]],
    //     reNewPassword: [null, [Validators.required]],
    //   },
    // );
  }

  mustBeDifferent() {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentPassword = control.get('currentPassword')?.value;
      const newPassword = control.get('newPassword')?.value;
      const reNewPassword = control.get('reNewPassword')?.value;

      // // console.log('Must Be Different');
      // // console.log('current password', currentPassword);
      // // console.log('new password', newPassword);
      // // console.log('re-enter new password', reNewPassword);

      if (newPassword === currentPassword) {
        return { samePassword: true };
      }

      return null;
    };
  }

  get fc() {
    return this.changePasswordForm.controls;
  }

  get formError() {
    return this.changePasswordForm.errors;
  }

  MustMatch(oldPassword: string, controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentPassword = control.get(oldPassword)?.value;
      const controlValue = control.get(controlName)?.value;
      const matchingControlValue = control.get(matchingControlName)?.value;
      let error: any = {};

      // // console.log('Must Match');
      // // console.log('current password', currentPassword);
      // // console.log('new password', controlValue);
      // // console.log('re-enter new password', matchingControlValue);

      if (currentPassword === controlValue) {
        error['samePassword'] = true;
        return error;
      }

      if (controlValue !== matchingControlValue && controlValue !== null) {
        error['mustMatch'] = true;
        return error;
      }

      // error = {};

      return null;
    };
  }

  public openPasswordChangePopup() {
    this.changePasswordFormPopup.open({
      config: {
        container: 'body',
        backdrop: 'static',

        centered: true,
        scrollable: true,
        modalDialogClass: '',
        backdropClass: 'custom-backdrop',
        windowClass: 'custom-window',
      },
      data: {
        showHeader: false,
        showFooter: false,
      },
    });
  }

  changePassword() {
    this.isLoading = true;
    this.changePasswordService
      .changePassword(this.changePasswordForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err: any) => {
          this.changePasswordFormPopup.close();
          this.changePasswordForm.reset();
          this.openFailure(
            'Sorry, we are unable to process your request, please try after sometime',
          );
          this.isLoading = false;
          return of(undefined);
        }),
      )
      .subscribe((res: any) => {
        if (res.status === 'SUCCESS') {
          this.changePasswordFormPopup.close();
          this.changePasswordForm.reset();
          this.openSuccess(res.statusDesc);
          this.isLoading = false;
        } else if (res.status === 'FAILED') {
          this.changePasswordFormPopup.close();
          this.changePasswordForm.reset();
          this.logger.debug('password updated successfully');
          if (res.statusDesc === undefined) {
            res.statusDesc = 'Current password does not matched!';
          }
          this.openFailure(res.statusDesc);
          this.isLoading = false;
        }
      });
  }

  private openSuccess(messsage: string) {
    Swal.fire({
      title: 'Password Changed Successfully',

      icon: 'success',
      heightAuto: false,
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.auth.logout();
        document.location.reload();
      }
    });
  }

  private openFailure(message: string) {
    Swal.fire({
      title: 'Password Updatation Failed',
      html: `
      <p>${message}</p>
      `,
      heightAuto: false,
      icon: 'error',
    }).then();
  }

  ngOnInit(): void {
    this.user$ = this.userDataService.userData$;
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    localStorage.clear();
    // document.location.reload();
    this.auth.logout();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  openChangePasswordPopup() {
    this.openPasswordChangePopup();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
