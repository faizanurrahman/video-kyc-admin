import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpLoaderService } from './core/services/http-loader.service';
import { AuthService } from './modules/auth';
import { TranslationService } from './modules/i18n';
// language list
import { AsyncPipe, NgIf } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { locale as jpLang } from './modules/i18n/vocabs/jp';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NGXLogger } from 'ngx-logger';
import { debounceTime, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { SessionTimeoutService } from './core/services/session-timeout.service';
import { SplashScreenComponent } from './_metronic/partials/layout/splash-screen/splash-screen.component';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

class Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe, SplashScreenComponent],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private mouseMoveSubject = new Subject<any>();
  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: any) {
    this.mouseMoveSubject.next(event);
  }

  private readonly logger = inject(NGXLogger);

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private authService: AuthService,
    public loader: HttpLoaderService,
    public router: Router,
    private destroyRef: DestroyRef,
    private sessionTimeoutService: SessionTimeoutService,
  ) {
    // register translations
    this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);

    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.loader.setLoading(true, 'router-events');
      } else if (event instanceof NavigationEnd) {
        this.loader.setLoading(false, 'router-events');
      }
    });

    this.mouseMoveSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(debounceTime(1000))
      .subscribe((res: any) => {
        this.sessionTimeoutService.startSessionTimeout();
        // this.logger.trace('mousemoved:  session restarted');
      });
  }

  ngOnInit() {
    this.modeService.init();

    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
