import { Component, OnInit } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-activity-drawer',
  templateUrl: './activity-drawer.component.html',
  standalone: true,
  imports: [InlineSVGModule],
})
export class ActivityDrawerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
