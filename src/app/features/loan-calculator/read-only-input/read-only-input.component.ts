import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-read-only-input',
  templateUrl: './read-only-input.component.html',
  styleUrls: ['./read-only-input.component.scss'],
  standalone: true,
})
export class ReadOnlyInputComponent implements OnChanges {
  @Input() value: string;

  ngOnChanges(change: SimpleChanges) {
    if (change.value && change.value.currentValue) {
      this.value = change.value.currentValue;
    }
  }

  // public init() {
  //   var inputValues = {
  //     price: {
  //       _value: 30000,
  //       set value(val) {
  //         this._value = parseFloat(val);
  //         var tiv = inputValues.trade_in_value.value;
  //         var cdp = inputValues.cash_down_payment.value;

  //         if (this._value < tiv + cdp) {
  //           if (this._value > tiv) {
  //             inputValues.cash_down_payment.value = this._value - tiv;
  //           } else {
  //             inputValues.cash_down_payment.value = 0;
  //             inputValues.trade_in_value.value = this._value;
  //           }
  //         }
  //       },
  //       get value() {
  //         return this._value;
  //       },
  //       min: 0,
  //       max: 500000,
  //       step: 5000,
  //       reset: function () {
  //         this._value = 30000;
  //       },
  //     },
  //     cash_down_payment: {
  //       _value: 6000,
  //       set value(val) {
  //         this._value = parseFloat(val);
  //         var sum = this._value + inputValues.trade_in_value.value;
  //         if (sum > inputValues.price.value) {
  //           inputValues.trade_in_value.value =
  //             inputValues.price.value - this._value;
  //         }
  //       },
  //       get value() {
  //         return this._value;
  //       },
  //       min: 0,
  //       get max() {
  //         return inputValues.price.value;
  //       },
  //       step: 500,
  //       reset: function () {
  //         this._value = 6000;
  //       },
  //     },
  //     trade_in_value: {
  //       _value: 0,
  //       set value(val) {
  //         this._value = parseFloat(val);
  //         var sum = this._value + inputValues.cash_down_payment.value;
  //         if (sum > inputValues.price.value) {
  //           inputValues.cash_down_payment.value =
  //             inputValues.price.value - this._value;
  //         }
  //       },
  //       get value() {
  //         return this._value;
  //       },
  //       min: 0,
  //       get max() {
  //         return inputValues.price.value;
  //       },
  //       step: 500,
  //       reset: function () {
  //         this._value = 0;
  //       },
  //     },
  //     tax_rate: {
  //       min: 0,
  //       max: 20,
  //       step: 0.1,
  //       _value: 0,
  //       get value() {
  //         return parseFloat(this._value);
  //       },
  //       set value(val) {
  //         this._value = val;
  //       },
  //       reset: function () {
  //         this._value = 0;
  //       },
  //     },
  //     term: {
  //       min: 12,
  //       max: 84,
  //       step: 12,
  //       _value: 60,
  //       get value() {
  //         return parseFloat(this._value);
  //       },
  //       set value(val) {
  //         this._value = val;
  //       },
  //       reset: function () {
  //         this._value = 60;
  //       },
  //     },
  //     apr: {
  //       min: 0,
  //       max: 30,
  //       step: 0.1,
  //       _value: 2.5,
  //       get value() {
  //         return parseFloat(this._value);
  //       },
  //       set value(val) {
  //         this._value = val;
  //       },
  //       reset: function () {
  //         this._value = 2.5;
  //       },
  //     },
  //   };

  //   var legendData = {
  //     get interest() {
  //       return this.est_total_cost - inputValues.price.value - this.taxes;
  //     },
  //     get taxes() {
  //       return (inputValues.price.value * inputValues.tax_rate.value) / 100;
  //     },
  //     get est_total_cost() {
  //       return (
  //         this.est_m_payment * inputValues.term.value +
  //         inputValues.cash_down_payment.value +
  //         inputValues.trade_in_value.value
  //       );
  //     },
  //     get est_m_payment() {
  //       var principal =
  //         this.taxes +
  //         inputValues.price.value -
  //         inputValues.cash_down_payment.value -
  //         inputValues.trade_in_value.value;
  //       var r = inputValues.apr.value / 1200;
  //       var n = inputValues.term.value;
  //       var t = Math.pow(1 + r, n);

  //       if (!r) {
  //         return 0;
  //       }

  //       return (principal * r * t) / (t - 1);
  //     },
  //   };

  //   var chartData = [
  //     {
  //       label: 'Interest',
  //       id: 'interest',
  //       color: '#F79082',
  //       get value() {
  //         return legendData.interest;
  //       },
  //     },
  //     {
  //       label: 'Taxes',
  //       id: 'taxes',
  //       color: '#DBEFAF',
  //       get value() {
  //         return (inputValues.price.value * inputValues.tax_rate.value) / 100;
  //       },
  //     },
  //     {
  //       label: 'Trade-In Value',
  //       id: 'trade-in-value',
  //       color: '#88D2E0',
  //       get value() {
  //         return inputValues.trade_in_value.value;
  //       },
  //     },
  //     {
  //       label: 'Cash Down Payment',
  //       id: 'cash_down_payment',
  //       color: '#4098FF',
  //       get value() {
  //         return inputValues.cash_down_payment.value;
  //       },
  //     },
  //     {
  //       label: 'Vehicle Price',
  //       id: 'price',
  //       color: '#5A6372',
  //       get value() {
  //         return inputValues.price.value;
  //       },
  //     },
  //   ];

  //   draw();

  //   function draw() {
  //     var paddingTop = 30;

  //     var tooltip = d3
  //       .select('.chart-box')
  //       .append('div')
  //       .attr('class', 'tooltip');

  //     tooltip.append('div').attr('class', 'color-icon');

  //     tooltip.append('div').attr('class', 'label');

  //     var chart = document.querySelector('.chart');
  //     chart.innerHTML = '';

  //     var width = chart.offsetWidth;
  //     var height = chart.offsetWidth + 2;

  //     var radius = width / 2;

  //     var color = d3
  //       .scaleOrdinal()
  //       .domain(
  //         chartData.map(function (d) {
  //           return d.label;
  //         })
  //       )
  //       .range(function (d) {
  //         return d.color;
  //       });

  //     var svg = d3
  //       .select('.chart')
  //       .append('svg')
  //       .attr('width', width)
  //       .attr('height', height)
  //       .append('g')
  //       .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  //     var donutWidth = width > 250 ? 30 : 20;
  //     var innerRadius = radius - donutWidth;
  //     var arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

  //     var pie = d3
  //       .pie()
  //       .padAngle(0.007)
  //       .value(function (d) {
  //         return d.value;
  //       })
  //       .sort(null);

  //     var path = svg
  //       .selectAll('path')
  //       .data(pie(chartData))
  //       .enter()
  //       .append('path')
  //       .attr('d', arc)
  //       .attr('fill', function (d) {
  //         return d.data.color;
  //       });

  //     path.on('mouseover', function (d) {
  //       var x = arc.centroid(d)[0];
  //       var y = arc.centroid(d)[1];

  //       var r = innerRadius + donutWidth / 2;
  //       var cos = x / r;
  //       var sin = y / r;

  //       var top = height / 2 + y + paddingTop;
  //       var left = width / 2 + x;

  //       tooltip.select('.label').text(d.data.label);
  //       tooltip
  //         .style('top', top + 'px')
  //         .style('left', left + 'px')
  //         .style('display', 'flex');

  //       tooltip.select('.color-icon').style('background-color', d.data.color);

  //       if (cos > 0.5) {
  //         tooltip.attr('class', 'tooltip west');
  //       } else if (cos < -0.5) {
  //         tooltip.attr('class', 'tooltip east');
  //       } else if (sin > 0.86) {
  //         tooltip.attr('class', 'tooltip south');
  //       } else {
  //         tooltip.attr('class', 'tooltip north');
  //       }
  //     });

  //     path.on('mouseout', function () {
  //       tooltip.style('display', 'none');
  //     });

  //     var estimateText = d3
  //       .select('.chart')
  //       .append('div')
  //       .attr('class', 'estimate');

  //     estimateText
  //       .append('div')
  //       .attr('class', 'estimate__heading')
  //       .append('text')
  //       .html('Estimated<br>monthly payment*');

  //     estimateText
  //       .append('div')
  //       .attr('class', 'estimate__value')
  //       .text(Math.ceil(legendData.est_m_payment));

  //     // controllers
  //     document.querySelectorAll('.controller-row').forEach(function (group) {
  //       var min = inputValues[group.id].min;
  //       var max = inputValues[group.id].max;
  //       var value = inputValues[group.id].value;
  //       var step = inputValues[group.id].step;

  //       var boundary = max ? (100 * (value - min)) / (max - min) : 0;

  //       var range = group.querySelector('input[type=range]');

  //       range.setAttribute(
  //         'style',
  //         'background-image: linear-gradient(90deg, #4098FF 0%, #4098FF ' +
  //           boundary +
  //           '%, white ' +
  //           boundary +
  //           '%);'
  //       );
  //       range.min = min;
  //       range.max = max;
  //       range.value = value;
  //       range.step = step;

  //       var textInput = group.querySelector('input[type=number]');
  //       textInput.min = min;
  //       textInput.max = max;
  //       textInput.value = value;
  //       textInput.step = step;
  //     });

  //     // legends
  //     document
  //       .querySelectorAll('.chart__description-value')
  //       .forEach(function (valueWrapper) {
  //         var value = legendData[valueWrapper.classList[1]];
  //         valueWrapper.textContent = Math.round(value);
  //       });
  //   }

  //   document.querySelectorAll('.info').forEach(function (element) {
  //     element.addEventListener('mouseover', function (e) {
  //       if (e.screenY > window.innerHeight / 2 + 100) {
  //         element.querySelector('.info__tooltip').classList.add('north');
  //       } else {
  //         element.querySelector('.info__tooltip').classList.remove('north');
  //       }
  //     });
  //   });

  //   document.querySelectorAll('.controller-row').forEach(function (group) {
  //     var range = group.querySelector('input[type=range]');
  //     var textInput = group.querySelector('input[type=number]');
  //     var id = group.id;

  //     range.addEventListener('input', function (e) {
  //       inputValues[id].value = e.target.value;
  //       draw();
  //     });
  //     textInput.addEventListener('change', function (e) {
  //       inputValues[id].value = e.target.value;
  //       draw();
  //     });
  //   });

  //   document
  //     .querySelector('.btn__reset')
  //     .addEventListener('click', function () {
  //       Object.values(inputValues).map(function (value) {
  //         value.reset();
  //       });
  //       draw();
  //     });

  //   document.querySelectorAll('.btn__toggle-modal').forEach(function (btn) {
  //     btn.addEventListener('click', function () {
  //       var dialog = document.querySelector('.dialog');
  //       dialog.classList.toggle('open');
  //     });
  //   });

  //   d3.select(window).on('resize', draw);

  // }
}
