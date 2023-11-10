import { Component, HostBinding, OnInit } from '@angular/core';
import { ChatInnerComponent } from '../../../../_metronic/partials/content/chat-inner/chat-inner.component';
import { DropdownMenu1Component } from '../../../../_metronic/partials/content/dropdown-menus/dropdown-menu1/dropdown-menu1.component';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
  standalone: true,
  imports: [DropdownMenu1Component, ChatInnerComponent],
})
export class GroupChatComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-lg-row';

  constructor() {}

  ngOnInit(): void {}
}
