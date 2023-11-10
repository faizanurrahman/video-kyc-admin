import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-top-bar.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthTopBarComponent {

}
