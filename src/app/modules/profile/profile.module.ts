import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { CampaignsComponent } from './campaigns/campaigns.component';
import { ConnectionsComponent } from './connections/connections.component';
import { DocumentsComponent } from './documents/documents.component';
import { OverviewComponent } from './overview/overview.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    InlineSVGModule,
    ProfileComponent,
    OverviewComponent,
    ProjectsComponent,
    CampaignsComponent,
    DocumentsComponent,
    ConnectionsComponent,
  ],
})
export class ProfileModule {
  constructor() {
    // // console.log('%cProfileModule Loaded', 'color: #0f0; font-size: 20px; font-weight: bold;');
  }
}
