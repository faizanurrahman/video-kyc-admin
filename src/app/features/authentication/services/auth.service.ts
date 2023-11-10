import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChatwootService } from '../../../core/services/chatwoot.service';
import { CryptoService } from '../../../core/services/crypto.service';
import { StorageService } from '../../../core/services/storage.service';
import { AuthModel } from '../../../modules/auth/models/auth.model';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import { UserModel } from '../../../modules/auth/models/user.model';
import { AuthHTTPService } from '../../../modules/auth/services/auth-http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  currentSessionIdBS: BehaviorSubject<string | undefined>;
  currentSessionId$: Observable<string | undefined>;

  currentIbUserSubject: BehaviorSubject<IbUserModel>;

  get currentIbUser$() {
    return this.currentIbUserSubject.asObservable();
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  get currentSessionId(): string | undefined {
    return this.currentSessionIdBS.value;
  }

  set currentSessionId(value: string | undefined) {
    this.currentSessionIdBS.next(value);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private _storage: StorageService,
    private _crypto: CryptoService,
    private chatWootService: ChatwootService, // private appRef: ApplicationRef
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.currentSessionIdBS = new BehaviorSubject<string | undefined>(undefined);
    this.currentSessionId$ = this.currentSessionIdBS.asObservable();
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  logout() {
    // let isLogout = true;
    this._storage.clear('local');

    this.router
      .navigate(['/auth/login'], {
        queryParams: {
          logout: false,
        },
      })
      .then();

    this.chatWootService.hideChatwoot();
    this.chatWootService.resetChatwootSession();

    // this.appRef.tick();

    // this.cdr.detectChanges();
  }

  // hideChatwootWidget() {
  //   setTimeout(() => {
  //     const chatwootWidget = document.querySelector('.woot--bubble-holder');
  //     if (chatwootWidget) {
  //       chatwootWidget.classList.add('d-none');
  //     }
  //   }, 0);
  // }

  // showChatwootWidget() {
  //   setTimeout(() => {
  //     const chatwootWidget = document.querySelector('.woot--bubble-holder');
  //     if (chatwootWidget) {
  //       chatwootWidget.classList.remove('d-none');
  //     }
  //   }, 0);
  // }

  getUserByToken(): Observable<UserType> {
    // // console.log('getUserByToken');
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false)),
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // for internet banking
  ibLogin(username: string, password: string): Observable<IbUserModel> {
    // const url = `${environment.apiUrl}/pfsvc/login/authenticate`;

    // return this.authHttpService.ibLogin(username, password).pipe(
    //   tap((value: IbUserModel) => {
    //     // set current user as observable
    //     // this.currentIbUserSubject.next(value);
    //     // store the encrypted session id in session storage
    //     this._storage.set('sessionId', this._crypto.encrypt(value.sessionId), 'local');

    //     // set the session Id
    //     this.currentSessionId = value.sessionId;

    //     // store the encrypted values
    //     this._storage.set('user-data', this._crypto.encrypt(JSON.stringify(value)), 'local');

    //     // Load Chat Woot
    //     // this.showChatwootWidget();

    //     // detect changes

    //     // this.appRef.tick();
    //   }),
    // );
    return of({
      name: 'test',
      loginId: 'admin',
      password: 'password',
      sessionId: 'random session',
    }).pipe(
      tap((value: any) => {
        // set current user as observable
        // this.currentIbUserSubject.next(value);
        // store the encrypted session id in session storage
        this._storage.set('sessionId', this._crypto.encrypt(value.sessionId), 'local');

        // set the session Id
        this.currentSessionId = value.sessionId;

        // store the encrypted values
        this._storage.set('user-data', this._crypto.encrypt(JSON.stringify(value)), 'local');

        // Load Chat Woot
        // this.showChatwootWidget();

        // detect changes

        // this.appRef.tick();
      }),
    );
  }

  // check the session validity
  isSessionExpired() {
    // return !this.currentSessionId;
    // // console.log('session id');
    // return false;
    return !this._crypto.decrypt(this._storage.get('sessionId'));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
