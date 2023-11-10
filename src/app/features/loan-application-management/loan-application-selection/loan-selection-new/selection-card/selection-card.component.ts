import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ClickableDirective } from '../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';

@Component({
  selector: 'app-selection-card',
  standalone: true,
  imports: [CommonModule, ClickableDirective],
  templateUrl: './selection-card.component.html',
  styleUrls: ['./selection-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionCardComponent {
  @Input({ alias: 'title', required: true }) title: string;
  @Input({ alias: 'imageUrl', required: true }) imageUrl: string;
  @Output('selected') selected: EventEmitter<void> = new EventEmitter();
  @Input() isDisabled: any;
}
