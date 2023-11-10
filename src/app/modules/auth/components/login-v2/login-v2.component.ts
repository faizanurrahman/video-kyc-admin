/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { NgIf, NgStyle } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  HostListener,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VirtualKeyboardComponent } from '@shared/ui/components/virtual-keyboard/virtual-keyboard.component';
import { CustomValidators } from '@shared/utils/custom-validators';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ChatwootService } from '../../../../core/services/chatwoot.service';
import { AuthService } from '../../../../features/authentication/services/auth.service';
import { AlertComponent } from '../../../../shared/ui/components/alert/alert.component';
import { PasswordInputComponent } from '../../../../shared/ui/components/password-input/password-input.component';
import { AutoAnimateDirective } from '../../../../shared/ui/directives/dom-event-directives/auto-animate.directive';
import { ClickableDirective } from '../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { IbUserModel } from '../../models/ib-user.model';

@Component({
  selector: 'app-login-v2',
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.scss'],
  standalone: true,
  imports: [
    VirtualKeyboardComponent,
    NgIf,
    AlertComponent,
    InlineSVGModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    NgStyle,
    PasswordInputComponent,
    AutoAnimateDirective,
    ClickableDirective,
  ],
  providers: [
    // { provide: GLOBAL_AUTO_ANIMATE_OPTIONS, useValue: {} },
  ],
})
export class LoginV2Component {
  // destroy subscription

  public hasError$: Subject<boolean> = new Subject<boolean>();
  public errorMessage$: Subject<string> = new Subject<string>();

  public loading$: Subject<boolean> = new Subject<boolean>();

  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    if (this.showVirtualKeyboard) {
      event.preventDefault();
    }
  }

  @HostBinding('class') classList = ' w-100';

  loginForm: FormGroup;

  returnUrl: string;
  isLoading$: Observable<boolean>;

  backgroundImageUrl: string = 'assets/media/illustrations/login-illust-1.svg';

  showVirtualKeyboard: boolean = false;

  isLoginFormInvalid: boolean = false;

  isLoading: boolean = false;

  hasError: boolean;
  errorMessage: string = 'Incorrect username or password.';

  value = '';
  keyboard: Keyboard;

  @ViewChild('simpleKeyboard', { static: true }) simpleKeyboard: ElementRef;

  @ViewChild('eyeIcon', { static: true }) eyeIcon: ElementRef;

  keyboardPressKey: FormControl = new FormControl('', {
    updateOn: 'change',
  });

  currentlyFocusedInput: string = 'username';

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private _toastr: ToastrService,
    private chatwootService: ChatwootService, // private layoutInitService: LayoutInitService,
    private destroyRef: DestroyRef,
  ) {
    this.isLoading$ = this.authService.isLoading$;

    setTimeout(() => {
      this.chatwootService.showChatwoot();
    }, 3000);
  }

  // convenience getter for easy access to form fields
  get fc() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  toggleVirtualKeyboard() {
    this.showVirtualKeyboard = !this.showVirtualKeyboard;

    if (this.showVirtualKeyboard) {
      // this.backgroundImageUrl = '';
    } else {
      // this.backgroundImageUrl = 'assets/media/illustrations/login-illust-1.svg';
    }

    this._cdr.detectChanges();
  }

  initForm() {
    this.loginForm = this.fb.group(
      {
        username: [
          null,
          Validators.compose([
            Validators.required,

            Validators.minLength(4),
            Validators.maxLength(50),
          ]),
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
            CustomValidators.passwordValidator,
          ]),
        ],
      },
      {
        updateOn: 'change',
      },
    );
  }

  loginFormSubmitted() {
    this.isLoading = true;
    this.hasError = false;

    // todo: remove this, we are using the form validation
    if (this.loginForm.invalid) {
      this.isLoginFormInvalid = true;
      this.errorMessage = 'Please enter your login id and password.';
      this.hasError = true;

      this._toastr.error(this.errorMessage, 'Error');

      return;
    }

    this.authService
      .ibLogin(this.fc.username.value, this.fc.password.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: IbUserModel | undefined) => {
          if (!res) {
            this.hasError = true;
            this.errorMessage = 'Something went wrong, try again';
            this.isLoading = false;
            this._cdr.markForCheck();
            return;
          }

          if (res.statusCode === '114' || res.statusCode === '102') {
            this.hasError = true;
            this.errorMessage = res.statusDesc.split('_').join(' ').trim().toLowerCase();
          } else {
            this.hasError = false;
            this.router.navigate([this.returnUrl]).then(() => {
              // You can add any necessary logic here
            });

            // You can add any necessary logic here
          }

          this.isLoading = false;
          this._cdr.markForCheck();
        },

        error: (error: HttpErrorResponse) => {
          this.hasError = true;
          this.errorMessage = error.error.statusDesc;
          this.isLoading = false;

          this._toastr.error(this.errorMessage, 'Authentication Failed');
          this._cdr.markForCheck();

          // console.log(error);
        },
      });
  }

  //
  setLoginFormValue(value: string) {
    //
    if (this.currentlyFocusedInput === 'username') {
      this.loginForm.patchValue({
        username: value,
      });
      this.fc.username.markAsDirty();
      this.fc.username.markAsTouched();
    }

    //
    if (this.currentlyFocusedInput === 'password') {
      this.loginForm.patchValue({
        password: value,
      });

      this.fc.password.markAsDirty();
      this.fc.password.markAsTouched();
    }
  }

  //
  getLoginFormValue() {
    if (this.currentlyFocusedInput === 'username') {
      return this.loginForm.value.username;
    }

    if (this.currentlyFocusedInput === 'password') {
      return this.loginForm.value.password;
    }
  }

  onLoginFormInputFocus(type: string, event: any) {
    // this.keyboardPressKey.setValue(event.target.value);
    this.currentlyFocusedInput = type;
    this.hasError = false;
    // this.setLoginFormValue(event.target.value);

    //
  }

  onVirtualKeyboardKeyClicked(event: any) {
    // // console.log('onVirtualKeyboardKeyClicked', event);
    // const oldValue = this.getLoginFormValue();
    this.setLoginFormValue(event);
  }

  setVirtualKeyboardValue() {
    const oldValue = this.getLoginFormValue() || '';
    return oldValue;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

    this.chatwootService.hideChatwoot();
  }
}
