import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  constructor() // private _router: Router, // private _activatedRoute: ActivatedRoute,
  // private authService: AuthService,
  // private chatwootService: ChatwootService,
  {
    // console.log('auth component constructed');
    // this.chatwootService.initChatwoot();
    // this.chatwootService.setDefaultUser();
    // this.chatwootService.showChatwoot();
  }

  ngOnInit(): void {
    document.body.classList.add('bg-body');
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-body');
    // this.chatwootService.hideChatwoot();
    // console.log('auth component destroy');
  }
}
