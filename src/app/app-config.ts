import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  NavigationError,
  provideRouter,
  UrlSerializer,
  withHashLocation,
  withInMemoryScrolling,
  withNavigationErrorHandler,
  withRouterConfig,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GLOBAL_AUTO_ANIMATE_OPTIONS } from 'ng-auto-animate';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { appRoutes } from './app-routes';
import { HttpHeaderInterceptor } from './core/interceptors/http-header.interceptor';
import { HttpLoaderInterceptor } from './core/interceptors/http-loader.interceptor';
import { SessionManagementInterceptor } from './core/interceptors/session-management.interceptor';
import { MaskUrlSerializerService } from './core/services/mask-url-serializer.service';
import { AuthService } from './modules/auth';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve: any) => {
      resolve();
    });
  };
}

export const AppConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.TRACE,

        serverLogLevel: NgxLoggerLevel.ERROR, // Optional: Set the server log level
        disableConsoleLogging: false,
      }),
      TranslateModule.forRoot(),

      ToastrModule.forRoot({
        preventDuplicates: true,
        timeOut: 3000,
        positionClass: 'toast-top-right',
        toastClass: ' ngx-toastr',
        countDuplicates: false,
        progressBar: true,
        resetTimeoutOnDuplicate: false,
        maxOpened: 1,
        progressAnimation: 'increasing',
        tapToDismiss: true,
      }),
    ),
    { provide: GLOBAL_AUTO_ANIMATE_OPTIONS, useValue: { duration: 3000 } },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionManagementInterceptor,
      multi: true,
    },
    provideAnimations(),
    provideEnvironmentNgxMask(),

    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      appRoutes,

      // environment.isMockEnabled
      //   ? withDebugTracing()
      //   : withNavigationErrorHandler((e: NavigationError) => {
      //       console.error('Navigation Error: ', e.error);
      //     }),
      withHashLocation(),
      withInMemoryScrolling(),
      withNavigationErrorHandler((e: NavigationError) => {
        console.error('Navigation Error: ', e.error);
      }),
      // withPreloading(PreloadAllModules),
      withRouterConfig({
        urlUpdateStrategy: 'eager',
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
        canceledNavigationResolution: 'replace',
      }),
    ),

    { provide: UrlSerializer, useClass: MaskUrlSerializerService },
  ],
};
