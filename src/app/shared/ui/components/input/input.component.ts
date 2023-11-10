import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  // providers: [
  //   { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true },
  //   { provide: NG_VALIDATORS, useExisting: forwardRef(() => InputComponent), multi: true}

  // ]
})
export class InputComponent implements OnInit {
  @Input() label: string;
  @Input() type: string;
  @Input() control: FormControl;
  @Input() validationMessage: string;
  @Input() options: string[];

  constructor() {}

  ngOnInit(): void {}

  // // Holds the value of the control
  // private innerValue: any;

  // private _validator: any;

  //   public set validator(val: any) {
  //     this._validator = val;
  //   }

  //   public get validator(): any {
  //     return this._validator;
  //   }

  // // Event emitters for the control
  // private onTouchedCallback: () => void;
  // private onChangeCallback: (_: any) => void;

  // // protected control: FormControl;

  // constructor () { }

  // ngOnInit() {
  //   // this.control = new FormControl();
  //   // this.control.valueChanges.pipe(
  //   //   distinctUntilChanged(),
  //   //   debounceTime(500),

  //   // ).subscribe((value) => {
  //   //   // // console.log('valueChanges: ' + value);
  //   //   this.value = value;
  //   // })
  // }

  // //getter and setter
  // get value(): any {
  //   return this.innerValue;
  // }

  // set value(v: any) {
  //   if (v !== this.innerValue) {
  //       this.innerValue = v;
  //       this.onChangeCallback(v);
  //   }
  // }

  // //From ControlValueAccessor interface
  // writeValue(value: any) {
  //   // // console.log('writeValue: ' + value  + ' ' + this.innerValue)
  //   if (value !== this.innerValue) {
  //       this.innerValue = value;
  //   }
  // }

  // registerOnChange(fn: any) {
  //   this.onChangeCallback = fn;
  // }

  // registerOnTouched(fn: any) {
  //   this.onTouchedCallback = fn;
  // }

  // validate(c: FormControl) {

  //   return this._validator(c);
  // }
}
