import { Component, OnInit } from '@angular/core';
import { ChatInnerComponent } from '../../../content/chat-inner/chat-inner.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-messenger-drawer',
  templateUrl: './messenger-drawer.component.html',
  standalone: true,
  imports: [InlineSVGModule, ChatInnerComponent],
})
export class MessengerDrawerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
