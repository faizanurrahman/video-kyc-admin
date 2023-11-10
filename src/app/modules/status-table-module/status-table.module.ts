import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { StatusTableComponent } from './status-table.component';

@NgModule({
  declarations: [StatusTableComponent],
  imports: [CommonModule, InlineSVGModule, FormsModule],
  exports: [StatusTableComponent],
})
export class StatusTableModule {}
