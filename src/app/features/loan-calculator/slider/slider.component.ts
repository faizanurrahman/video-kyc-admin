import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import noUiSlider, { API, Options } from 'nouislider';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class SliderComponent implements AfterViewInit, OnChanges, ControlValueAccessor {
  @ViewChild('sliderRef') sliderRef: ElementRef;
  @Input() min: number = 20000;
  @Input() max: number = 80000;
  @Input() start: number = 63000;
  @Input() currency: string = 'US $';
  @Input() formatPrefix: string;
  private options: Options;

  @Input() step: any;
  @Input() prefix: any;
  @Input() postfix: any;

  @Input() currentValue: number | number[];

  @Output() valueChange: any = new EventEmitter();

  private _value: number | number[];
  private _disabled: boolean = false;

  private _onChange: (value: number | number[]) => void = () => {};
  private _onTouched: () => void = () => {};

  private slider: API;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {
    this.initSlider();
  }

  private initSlider() {
    this.slider = noUiSlider.create(this.sliderRef.nativeElement, {
      start: this.start,
      connect: [true, false],
      range: {
        min: this.min,
        max: this.max,
      },
      tooltips: [true],
      format: {
        to: value => {
          return (
            (this.prefix ? this.prefix + ' ' : '') +
            value.toFixed(1) +
            (this.postfix ? ' ' + this.postfix : '')
          );
        },
        from: value => {
          return parseFloat(value);
        },
      },
      animate: true,
      animationDuration: 600,
      step: this.step,
    });

    this.slider.on('update', (values: any, handle: any) => {
      let connectWidth = this.calculateConnectWidth(values[0]);
      this.setConnectWidth(connectWidth);
      this._onChange(values[0]);
      this.valueChange.emit(values[0]);
    });
  }

  private calculateConnectWidth(value: number) {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  private setConnectWidth(width: number) {
    let connect = this.sliderRef.nativeElement.querySelector('.noUi-connect');
    connect.style.transform = `translate(0%) scale(${width / 100}, 1)`;
  }

  public writeValue(obj: any): void {
    if (this._value !== obj) {
      this._value = obj;
      // this.slider.set(this._value);
      // this._onChange(this._value);
    }
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
