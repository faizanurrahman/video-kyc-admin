import { AsyncPipe, NgClass, NgIf, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import Swal from 'sweetalert2';
import { ChatwootService } from '../../../core/services/chatwoot.service';
import { SessionTimeoutService } from '../../../core/services/session-timeout.service';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { AuthService } from '../../../modules/auth';
import { PasswordInputComponent } from '../../../shared/ui/components/password-input/password-input.component';
import { ToggleEyeComponent } from '../../../shared/ui/components/toggle-eye/toggle-eye.component';
import { VirtualKeyboardComponent } from '../../../shared/ui/components/virtual-keyboard/virtual-keyboard.component';
import { ClickableDirective } from '../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { CustomValidators } from '../../../shared/utils/custom-validators';

import { VirtualKeyboardFocusedInputDirective } from './virtual-keyboard-focused-input.directive';
import { VirtualKeyboardService } from './virtual-keyboard.service';

@Component({
  selector: 'app-authentication-login',
  standalone: true,

  templateUrl: './authentication-login.component.html',
  styleUrls: ['./authentication-login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InlineSVGModule,
    ReactiveFormsModule,
    PasswordInputComponent,
    ClickableDirective,
    ToggleEyeComponent,
    RouterLink,
    NgIf,
    NgStyle,
    NgClass,
    VirtualKeyboardFocusedInputDirective,
    VirtualKeyboardComponent,
    AsyncPipe,
  ],
})
export class AuthenticationLoginComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit() {
    // this.setHeightOnScrollableContent();
  }

  // Reusable Swal
  swalToast = Swal.mixin({
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'custom-toast-popup',
      container: 'custom-toast-container',
      title: 'fw-bold fs-4 text-danger',
      timerProgressBar: 'bg-primary',
    },
    showClass: {
      popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster

    `,
    },
  });

  loginForm: FormGroup;
  returnUrl: string;
  errorMessage: string = 'Incorrect username or password';

  // ============ LIFE CYCLE HOOKS =============
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private chatwootService: ChatwootService,
    private destroyRef: DestroyRef,
    private renderer: Renderer2,
    public virtualKeyboardService: VirtualKeyboardService,
    private swalService: SweetAlertService,
    private sessionTimeoutService: SessionTimeoutService,
  ) {
    // Initialize chatwoot services
    setTimeout(() => {
      this.chatwootService.showChatwoot();
    }, 3000); // after 3second chatwoot will popup
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        loginId: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()\-_=+\\|/,.:;'"{}\[\]`~]*$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
            CustomValidators.passwordValidator,
          ],
        ],
      },
      { updateOn: 'change' },
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'.toString()] || '/';
    console.log('retrun url: ', this.returnUrl);

    // this.virtualKeyboardService.setFocusedInputElement()
  }

  ngOnDestroy() {
    this.chatwootService.hideChatwoot();
  }

  onPasswordChange() {}

  // ======== GETTER AND SETTERS =======
  get fc(): { [key: string]: AbstractControl<any, any> } {
    return this.loginForm.controls;
  }

  // ========= PRIVATE METHODS ========
  // ========= PUBLIC METHODS =========
  loginFromSubmitted() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter your login id and password.';
      // this.swalToast.fire({
      //   icon: 'error',
      //   title: 'Oops...',
      //   text: this.errorMessage,
      // });
      this.swalService.error('Invalid Details', 'Please enter your login id and password');
      return;
    }

    this.router.navigate([this.returnUrl]).then(() => {});

    // this.authService
    //   .ibLogin(this.fc.loginId.value, this.fc.password.value)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (res: IbUserModel | undefined) => {
    //       if (!res) {
    //         // this.swalToast.fire({
    //         //   icon: 'error',
    //         //   title: 'Oops...',
    //         //   text: 'Timeout Error, Try Again',
    //         // });
    //         this.swalService.error('Error', 'Timeout Error, Try Again');
    //         return;
    //       }

    //       if (res.statusCode === '114' || res.statusCode === '102') {
    //         this.errorMessage = res.statusDesc
    //           .split('_')
    //           .join(' ')
    //           .split('-')
    //           .join(' ')
    //           .trim()
    //           .toLowerCase();
    //         // this.swalToast.fire({
    //         //   icon: 'error',
    //         //   title: 'Oops...',
    //         //   text: this.errorMessage,
    //         // });

    //         this.swalService.error('Error', this.errorMessage);
    //       }

    //       this.router.navigate([this.returnUrl]).then(() => {});
    //       this.sessionTimeoutService.startSessionTimeout();
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.errorMessage = error.error.statusDesc;
    //       // this.swalToast.fire({
    //       //   icon: 'error',
    //       //   title: 'Authentication Failed',
    //       //   text: this.errorMessage,
    //       // });
    //       this.swalService.error('Error', 'Server Unreachable, Try Again');
    //       // console.log('error: ', error);
    //     },
    //   });
  }

  // =========================== Virtual Keyboard =====================
  showVirtualKeyboard: boolean = false;
  // virtualKeyboardService = Inject(VirtualKeyboardService);
  toggleVirtualKeyboard() {
    this.showVirtualKeyboard = !this.showVirtualKeyboard;
    this.virtualKeyboardService.toggleKeyboard(this.showVirtualKeyboard);
  }

  // ================== Virtual Keyboard ================

  moveFocus() {
    let nextElement = this.virtualKeyboardService.getNextFocusElement();
    nextElement?.focus();
  }

  onVirtualKeyboardKeyClicked(newValue: any) {
    // console.log('on virtual keyboard clicked', newValue);

    this.virtualKeyboardService.getFocusedInputElement()!.value = newValue;
    const event = new Event('change', { bubbles: true, cancelable: true, composed: true });
    this.virtualKeyboardService.getFocusedInputElement()!.dispatchEvent(event);
  }

  setVirtualKeyboardValue() {
    if (this.virtualKeyboardService.getFocusedInputElement()) {
      return this.virtualKeyboardService.getFocusedInputElement()!.value;
    }
    return '';
  }
}
