import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { VirtualKeyboardComponent } from '../../shared/ui/components/virtual-keyboard/virtual-keyboard.component';
import { VirtualKeyboardService } from './authentication-login/virtual-keyboard.service';
import { AuthTopBarComponent } from './components/auth-top-bar/auth-top-bar.component';
import { BrandLogoComponent } from './components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BrandLogoComponent,
    AuthTopBarComponent,
    InlineSVGModule,
    VirtualKeyboardComponent,
  ],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, public virtualKeyboardService: VirtualKeyboardService) {}

  ngAfterViewInit() {}

  // ================== Virtual Keyboard ================

  moveFocus() {
    let nextElement = this.virtualKeyboardService.getNextFocusElement();
    nextElement?.focus();
  }

  onVirtualKeyboardKeyClicked(newValue: any) {
    // console.log('on virtual keyboard clicked', newValue);

    this.virtualKeyboardService.getFocusedInputElement()!.value = newValue;
    const event = new Event('change', { bubbles: true, cancelable: true, composed: true });
    this.virtualKeyboardService.getFocusedInputElement()!.dispatchEvent(event);
  }

  setVirtualKeyboardValue() {
    if (this.virtualKeyboardService.getFocusedInputElement()) {
      return this.virtualKeyboardService.getFocusedInputElement()!.value;
    }
    return '';
  }
}
