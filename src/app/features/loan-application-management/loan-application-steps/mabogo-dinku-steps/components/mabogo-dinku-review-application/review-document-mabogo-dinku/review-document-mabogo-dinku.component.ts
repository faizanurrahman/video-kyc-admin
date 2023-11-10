import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-document-mabogo-dinku',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-document-mabogo-dinku.component.html',
  styleUrls: ['./review-document-mabogo-dinku.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewDocumentMabogoDinkuComponent {

}
