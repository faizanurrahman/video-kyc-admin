import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router, RouterLink } from '@angular/router';
import {Subscription} from 'rxjs';
import {LayoutService} from '../../core/layout.service';
import {MenuComponent} from '../../../kt/components';
import { TopbarComponent } from '../topbar/topbar.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    InlineSVGModule,
    RouterLink,
    PageTitleComponent,
    HeaderMenuComponent,
    TopbarComponent,
  ],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headerContainerCssClasses: string = '';
  asideDisplay: boolean = true;
  headerLeft: string = 'menu';
  pageTitleCssClasses: string = '';
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  @ViewChild('ktPageTitle', {static: true}) ktPageTitle: ElementRef;

  private unsubscribe: Subscription[] = [];

  constructor(private layout: LayoutService, private router: Router) {
    this.routingChanges();
  }

  ngOnInit(): void {
    this.headerContainerCssClasses = this.layout.getStringCSSClasses('headerContainer');
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.headerLeft = this.layout.getProp('header.left') as string;
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');
  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (this.pageTitleAttributes.hasOwnProperty(key)) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        MenuComponent.reinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
  }
}
