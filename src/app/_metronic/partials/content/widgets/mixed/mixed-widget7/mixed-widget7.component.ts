import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgClass } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DropdownMenu1Component } from '../../../dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
@Component({
  selector: 'app-mixed-widget7',
  templateUrl: './mixed-widget7.component.html',
  standalone: true,
  imports: [
    InlineSVGModule,
    DropdownMenu1Component,
    NgApexchartsModule,
    NgClass,
  ],
})
export class MixedWidget7Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = getChartOptions(this.chartHeight, this.chartColor);
  }
}

function getChartOptions(chartHeight: string, chartColor: string) {
  const baseColor = getCSSVariableValue('--kt-' + chartColor);
  const lightColor = getCSSVariableValue('--kt-' + chartColor + '-light');
  const labelColor = getCSSVariableValue('--kt-gray-700');

  return {
    series: [74],
    chart: {
      fontFamily: 'inherit',
      height: chartHeight,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '65%',
        },
        dataLabels: {
          name: {
            show: false,
            fontWeight: '700',
          },
          value: {
            color: labelColor,
            fontSize: '30px',
            fontWeight: '700',
            offsetY: 12,
            show: true,
            formatter: function (val: number) {
              return val + '%';
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: '100%',
        },
      },
    },
    colors: [baseColor],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };
}
