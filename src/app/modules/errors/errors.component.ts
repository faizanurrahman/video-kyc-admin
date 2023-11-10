import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
} from '../../_metronic/kt/components';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ErrorsComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  routeToDashboard() {
    this.router.navigate(['dashboard']);
    setTimeout(() => {
      ToggleComponent.bootstrap();
      ScrollTopComponent.bootstrap();
      DrawerComponent.bootstrap();
      StickyComponent.bootstrap();
      MenuComponent.bootstrap();
      ScrollComponent.bootstrap();
    }, 200);
  }
}
