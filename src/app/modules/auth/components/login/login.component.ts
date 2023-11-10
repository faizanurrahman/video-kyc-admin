import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../../features/authentication/services/auth.service';
import { UserModel } from '../../models/user.model';

import { ToastrService } from 'ngx-toastr';
import Keyboard from 'simple-keyboard';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };

  reCAPTCHAToken: string = '';
  tokenVisible: boolean = false;
  siteKey = environment.recaptcha.siteKey;

  resolved(event: any) {
    // // console.log(event);
  }

  @HostBinding('class') classList = ' w-100';

  loginForm: FormGroup;

  returnUrl: string;
  isLoading$: Observable<boolean>;

  backgroundImageUrl: string = 'assets/media/illustrations/login-illust-1.svg';

  showVirtualKeyboard: boolean = false;
  isLoginFormInvalid: boolean = false;

  isLoading: boolean = false;
  isPasswordVisible: boolean = false;

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
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }

    // this.route.queryParamMap.subscribe((params) => {
    //   // // console.log('login page params: ', params);
    //   if (params.get('logout') == 'true') {
    //     this._toastr.info('You have been logged out.', 'Logged Out');
    //   }
    // });
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

    // this._cdr.detectChanges();
  }

  initForm() {
    this.loginForm = this.fb.group(
      {
        username: [
          null,
          Validators.compose([
            Validators.required,

            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        password: [
          this.defaultAuth.password,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        recaptcha: [null, []],
      },
      {
        updateOn: 'change',
      },
    );
  }

  loginFormSubmitted() {
    // this.recaptchaService
    //   .execute('importantAction')
    //   .subscribe((token: string) => {
    //     this.tokenVisible = true;
    //     this.reCAPTCHAToken = `Token [${token}] generated`;
    //   });
    this.hasError = false;

    // // console.log('form value', this.loginForm.getRawValue());

    if (this.loginForm.invalid) {
      this.isLoginFormInvalid = true;
      this.errorMessage = 'Please enter your username and password.';
      this.hasError = true;

      this._toastr.error(this.errorMessage, 'Error');

      return;
    }

    // // console.log('generated token: ', this.reCAPTCHAToken);

    this.isLoading = true;

    const loginSubscr = this.authService
      .login(this.fc.username.value, this.fc.password.value)
      .pipe(first())
      .subscribe({
        // On success
        next: (user: UserModel | undefined) => {
          if (user) {
            this.router.navigate([this.returnUrl]);
            setTimeout(() => {
              this._toastr.success('Welcome back! ' + user.username.toUpperCase(), 'Logged In');
            }, 500);
          } else {
            this.hasError = true;
            this.errorMessage = 'Username or password is incorrect.';
          }

          this.isLoading = false;

          this._cdr.detectChanges();
        },

        // On login error
        error: (error) => {
          this.hasError = true;
          this.errorMessage = 'Something went wrong.';

          this.isLoading = false;

          this._cdr.detectChanges();
        },
      });

    this.unsubscribe.push(loginSubscr);
  }

  //
  setLoginFormValue(value: string) {
    if (this.currentlyFocusedInput === 'username') {
      this.loginForm.patchValue({
        username: value,
      });
      this.fc.username.markAsDirty();
      this.fc.username.markAsTouched();
    }

    if (this.currentlyFocusedInput === 'password') {
      this.loginForm.patchValue({
        password: value,
      });

      this.fc.password.markAsDirty();
      this.fc.password.markAsTouched();
    }

    // this._cdr.detectChanges();
  }

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

  // toggle password visibility
  togglePasswordVisibility(password: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;

    if (this.isPasswordVisible) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }

  onVirtualKeyboardKeyClicked(event: any) {
    // // console.log('onVirtualKeyboardKeyClicked', event);
    const oldValue = this.getLoginFormValue();
    this.setLoginFormValue(event);
  }

  setVirtualKeyboardValue() {
    const oldValue = this.getLoginFormValue();
    if (oldValue === undefined || oldValue === null) {
      return '';
    }
    return oldValue;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
