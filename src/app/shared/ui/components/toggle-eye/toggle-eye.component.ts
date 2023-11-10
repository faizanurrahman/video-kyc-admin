import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'app-toggle-eye',
  standalone: true,
  imports: [NgIf, InlineSVGModule],
  templateUrl: './toggle-eye.component.html',
  styleUrls: ['./toggle-eye.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleEyeComponent {
  @Input({
    alias: 'isToggle',
    required: false,
  })
  public isToggle: boolean = false;

  @Output('toggled')
  private toggled: EventEmitter<any> = new EventEmitter();

  toggleEyeClicked(event: any) {
    this.isToggle = !this.isToggle;

    this.toggled.emit(this.isToggle);
  }
}
