import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { LayoutService } from '../../_metronic/layout';
import { NgClass, NgIf } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';

type Tabs = 'Header' | 'Toolbar' | 'PageTitle' | 'Aside' | 'Content' | 'Footer';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  standalone: true,
  imports: [
    InlineSVGModule,
    NgClass,
    FormsModule,
    NgIf,
  ],
})
export class BuilderComponent implements OnInit {
  activeTab: Tabs = 'Header';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
    this.configLoading = true;
    this.layout.setConfig(this.model);
    location.reload();
  }
}
