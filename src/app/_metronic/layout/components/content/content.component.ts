import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { DrawerComponent } from '../../../kt/components';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        // DrawerComponent.hideAll();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
