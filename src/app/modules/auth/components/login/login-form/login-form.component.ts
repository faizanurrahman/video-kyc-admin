import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, OnChanges {

  protected loginForm: FormGroup;
  protected isLoading: boolean = false;


  @Input() focusInputValue: any;
  @Output() loginFormSubmitEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() currentFocusInputEvent: EventEmitter<any> = new EventEmitter<any>();




  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef) { }



  get fc() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {

    this.initForm();

  }

  ngOnChanges(change: SimpleChanges) {
    // if (change.focusInputValue && change.focusInputValue.currentValue) {
    //   this.focusInputValue = change.focusInputValue.currentValue;
    //   this._cdr.detectChanges();
    // }
  }

  initForm() {
    this.loginForm = this._fb.group(
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
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        updateOn: 'change',
      },
    );
  }


  loginFormSubmitted() {
    this.loginFormSubmitEvent.emit(this.loginForm.value);
  }


  onLoginFormInputFocus(controlName: string, event: any) {
    this.currentFocusInputEvent.emit(this.fc[controlName]);
  }

}
