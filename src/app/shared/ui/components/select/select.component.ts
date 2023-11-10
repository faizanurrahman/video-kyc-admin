import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select',
  standalone: true,

  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @Input() options: { label: string; value: any }[];
  @Input() placeholder: string;

  formControl: FormControl;

  private onChangeCallback: (_: any) => void;
  private onTouchCallback: () => void;

  constructor(private destroyRef: DestroyRef) {}

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  validate(control: AbstractControl) {
    return null;
  }

  ngOnInit(): void {
    this.formControl = new FormControl();

    // this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
    //   // if (this.onChangeCallback) {
    //   //   this.onChangeCallback(value);
    //   // }
    //   // if (this.onTouchCallback) {
    //   //   this.onTouchCallback();
    //   // }
    // });
  }

  onFocus(event: any) {
    if (this.onTouchCallback) {
      this.onTouchCallback();
    }
  }

  onChange(event: any) {
    if (this.onChangeCallback) {
      this.onChangeCallback(event.value);
    }
  }

  ngOnDestroy(): void {}
}

/**
 * - Non-Form Element Example
 */

/**
 *
 *
 * import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-select',
  template: `
    <div class="form-group mb-5">
      <label class="form-label required" for="title">{{ label }}</label>
      <div
        class="list-item-group"
        [class.disabled]="disabled"
        [class.invalid]="isInvalid"
        tabindex="0"
        (click)="toggleOptions()"
      >
        <span class="list-item" *ngIf="!selectedOption">{{ placeholder }}</span>
        <span class="list-item" *ngIf="selectedOption">{{ selectedOption.key }}</span>
        <span class="list-item" *ngFor="let option of options; let i = index" (click)="selectOption(option)">
          {{ option.key }}
        </span>
      </div>
      <div *ngIf="isInvalid" class="invalid-feedback d-block">
        {{ validationMessage?.required }}
      </div>
    </div>
  `,
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: any[];
  @Input() placeholder: string;
  @Input() validationMessage: any;

  private _disabled: boolean = false;
  private _value: any;
  private _onChangeCallback: (_: any) => void;
  private _onTouchCallback: () => void;
  private isOptionsVisible: boolean = false;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  get disabled(): boolean {
    return this._disabled;
  }

  get selectedOption(): any {
    return this.options.find((option) => option.value === this._value);
  }

  get isInvalid(): boolean {
    return this._onTouchCallback && this._onTouchCallback() && this._value === null;
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  toggleOptions(): void {
    if (!this._disabled) {
      this.isOptionsVisible = !this.isOptionsVisible;
    }
  }

  selectOption(option: any): void {
    this._value = option.value;
    this.isOptionsVisible = false;
    if (this._onChangeCallback&& typeof this._onChangeCallback === 'function') {
      this._onChangeCallback(this._value);
    }
    if (this._onTouchCallback && typeof this._onTouchCallback === 'function') {
      this._onTouchCallback();
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    const hostElement = this.elementRef.nativeElement;
    if (!hostElement.contains(target)) {
      this.isOptionsVisible = false;
    }
  }
}

 *
 *
 *
 */
