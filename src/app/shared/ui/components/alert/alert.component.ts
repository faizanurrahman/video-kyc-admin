import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [InlineSVGModule, NgIf],
})
export class AlertComponent implements OnInit, OnChanges {
  @HostBinding('class') classes = 'alert d-flex align-items-center p-5';

  @Input() custom_alert: true | false = false;
  @Input() dismissible = false;
  @Input() type: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' = 'info';

  @Input() icon: 'default' | 'custom' = 'default';
  @Input() title: string = 'Alert Title';
  @Input() message: string = 'What cause this alert to shown';

  @Input() visible: true | false = true;

  constructor() {}

  ngOnChanges(change: SimpleChanges) {
    // if alert is not visible then compress the height of alert box
    if (this.visible) {
      this;
    }
  }

  ngOnInit() {
    // add classes
    this.classes = this.classes + ' ' + `alert-${this.type}`;
    if (this.dismissible) {
      this.classes = this.classes + ' ' + 'alert-dismissible';
    }
  }

  getIconColor() {
    return {
      'svg-icon-primary': this.type === 'primary',
      'svg-icon-secondary': this.type === 'secondary',
      'svg-icon-warning': this.type === 'warning',
      'svg-icon-danger': this.type === 'danger',
      'svg-icon-success': this.type === 'success',
      'svg-icon-info': this.type === 'info',
    };
  }
}
