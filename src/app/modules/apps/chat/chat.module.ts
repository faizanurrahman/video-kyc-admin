import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ChatComponent } from '../chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { DrawerChatComponent } from './drawer-chat/drawer-chat.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';

@NgModule({
  imports: [
    CommonModule,
    ChatRoutingModule,
    InlineSVGModule,
    ChatComponent,
    PrivateChatComponent,
    GroupChatComponent,
    DrawerChatComponent,
  ],
})
export class ChatModule {
  constructor() {
    // // console.log('%cChatModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
