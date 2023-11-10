import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-under-maintainance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './under-maintainance.component.html',
  styleUrls: ['./under-maintainance.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnderMaintainanceComponent {

}
