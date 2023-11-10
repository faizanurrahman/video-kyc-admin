import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import noUiSlider, { API } from 'nouislider';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-nouislider',
  templateUrl: './my-nouislider.component.html',
  styleUrls: ['./my-nouislider.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DecimalPipe],
  standalone: true,
})
export class MyNouisliderComponent implements AfterViewInit, OnInit {
  @ViewChild('sliderRef') sliderRef: ElementRef;
  @ViewChild('sliderRefValue') sliderRefValue: ElementRef<HTMLInputElement>;

  @Input() start: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() formatPrefix: string | null = null;
  @Input() formatSuffix: string | null = null;
  @Input() tooltip: boolean = true;
  @Input() step: number | null;
  @Input() floatPoints: number = 2;

  @Input() label: string = 'label';

  @Output() currentValue: EventEmitter<any> = new EventEmitter<any>();

  public sliderAPI: API;

  constructor(private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.currentValue.emit(this.start ? this.start : this.min);
  }

  ngAfterViewInit() {
    this.sliderAPI = noUiSlider.create(this.sliderRef.nativeElement, {
      range: {
        min: this.min,
        max: this.max,
      },
      connect: [true, false],
      orientation: 'horizontal',

      // Tooltips format
      tooltips: {
        to: (value: number) => {
          const floatValue = value.toFixed(this.floatPoints);
          let formattedString = floatValue.toString();

          if (this.formatPrefix === 'P') {
            formattedString = this.decimalPipe.transform(floatValue, '1.2')!; // Fix: format amount to 2 decimal places in tooltip
          }

          // If suffix is Mo then convert it to Yr if month is greater than 12
          if (this.formatSuffix === 'Mo') {
            const month = parseFloat(floatValue);
            // if (month > 12) {
            //   const year = month / 12;
            //   formattedString = year.toFixed(2) + ' Yr';
            // } else {
            //   formattedString = month.toFixed(0) + ' Mo';
            // }
            formattedString = month.toFixed(0) + ' Mo';
          }

          if (this.formatPrefix) {
            formattedString = this.formatPrefix + ' ' + formattedString;
          } else if (this.formatSuffix && this.formatSuffix !== 'Mo') {
            formattedString = formattedString + ' ' + this.formatSuffix;
          }

          return formattedString;
        },
        from: (value: string) => {
          let processedValue = value;
          if (this.formatPrefix) {
            processedValue = processedValue.replace(this.formatPrefix, '');
          } else if (this.formatSuffix) {
            processedValue = processedValue.replace(this.formatSuffix, '');
          }
          return parseFloat(processedValue);
        },
      },
      start: this.start ? this.start : 0,
      step: this.step ? this.step : undefined,
    });

    fromEvent(this.sliderAPI, 'update')
      .pipe()
      .subscribe((res: any) => {
        const newValue = res[0][0];
        let formattedValue = parseFloat(newValue).toFixed(this.floatPoints);
        this.sliderRefValue.nativeElement.value = this.formatNumber(formattedValue);
      });

    fromEvent(this.sliderAPI, 'change').subscribe((res: any) => {
      const newValue = res[0][0];
      let formattedValue = parseFloat(newValue).toFixed(this.floatPoints);
      this.currentValue.emit(formattedValue);
    });

    fromEvent(this.sliderRefValue.nativeElement, 'blur').subscribe((res: any) => {
      let value = res.target.value.toString().replace(/,/g, '').toString();
      this.sliderAPI.set(value);
      if (value <= this.max) {
        this.currentValue.emit(value);
      } else {
        // alert('max value should be: ' + this.max);
        // SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          heightAuto: false,
          text: 'Max value should be: ' + this.max,
        });
        this.currentValue.emit(this.max);
      }
    });
  }

  // Helper
  formatNumber(input: string) {
    const numericValue = parseFloat(input.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
