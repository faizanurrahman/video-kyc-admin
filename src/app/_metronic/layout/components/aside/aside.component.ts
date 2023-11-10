import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../modules/auth';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ToggleComponent,
} from '../../../kt/components';
import { LayoutService } from '../../core/layout.service';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { AsideNotificationComponent } from './aside-notification/aside-notification.component';
import { AsideProfileComponent } from './aside-profile/aside-profile.component';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    AsideMenuComponent,
    AsideNotificationComponent,
    AsideProfileComponent,
    NgOptimizedImage,
  ],
})
export class AsideComponent implements OnInit, OnDestroy {
  asideTheme: string = '';
  asideMinimize: boolean = false;
  asideMenuCSSClasses: string = '';

  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];

  constructor(private layout: LayoutService, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
    this.routingChanges();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();

      // Reset the position of the scroll to the top
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
