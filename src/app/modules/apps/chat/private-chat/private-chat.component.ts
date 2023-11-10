import { Component, HostBinding, OnInit } from '@angular/core';
import { ChatInnerComponent } from '../../../../_metronic/partials/content/chat-inner/chat-inner.component';
import { DropdownMenu1Component } from '../../../../_metronic/partials/content/dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
  standalone: true,
  imports: [
    InlineSVGModule,
    DropdownMenu1Component,
    ChatInnerComponent,
  ],
})
export class PrivateChatComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-lg-row';

  constructor() {}

  ngOnInit(): void {}
}
