import { Component } from '@angular/core';
import { Card4Component } from '../../../_metronic/partials/content/cards/card4/card4.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  standalone: true,
  imports: [InlineSVGModule, Card4Component],
})
export class DocumentsComponent {
  constructor() {}
}
