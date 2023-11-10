import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { SimpleKeyboard } from 'simple-keyboard';

@Component({
  selector: 'app-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgStyle],
})
export class VirtualKeyboardComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  @HostBinding('class') class = 'virtual-keyboard-component';

  keyboard: SimpleKeyboard;

  @Input() keyboardTransition: string = 'all 0.5s ease-in-out';
  @Input() value: string = '';
  @Input() showVirtualKeyboard: boolean | null = false;
  @Output() keyboardPressKey: EventEmitter<any> = new EventEmitter();
  @Output() moveFocusToNextInput: EventEmitter<any> = new EventEmitter();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._activatedRoute.queryParams.pipe(takeUntilDestroyed()).subscribe(() => {
      // // console.log('params', params);
    });

    this._router.events.pipe(takeUntilDestroyed()).subscribe((event: any) => {
      if (event instanceof RouterEvent) {
        if (event instanceof NavigationEnd) {
          if (
            event.url === '/auth/login' ||
            event.url === '/auth/register' ||
            event.url === '/auth/forgot-password' ||
            event.url === '/auth/login-v2' ||
            event.url === '/auth/login-v3'
          ) {
            // detect changes to re-render the keyboard
            // // console.log('detect changes to re-render the keyboard');
            // // console.log('event', event);

            this._cdr.detectChanges();
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.keyboard = new SimpleKeyboard('keyboard-container', {
      onChange: (input: string) => this.onChange(input),
      onKeyPress: (button: string, event: any) => this.onKeyPress(button, event),
    });
  }

  onChange = (_input: string) => {
    // // console.log('Input changed', input);
  };

  onKeyPress = (button: string, event: any) => {
    event.preventDefault();

    // // console.log('Button pressed', button);

    if (button === '{shift}') {
      this.handleShift();

      return;
    }

    if (button === '{lock}') {
      this.handleCaps();
      return;
    }

    if (button === '{tab}') {
      this.handleTab();
      return;
    }

    if (button === '{enter}') {
      this.keyboardPressKey.emit(this.value);
      return;
    }

    if (button === '{bksp}') {
      const oldValue = this.value;
      this.keyboardPressKey.emit(oldValue.slice(0, -1));
      return;
    }

    if (button === '{space}') {
      const oldValue = this.value;
      this.keyboardPressKey.emit(oldValue + ' ');
      return;
    }

    if (button === '{caps}') {
      // this.handleCaps();
      return;
    }

    this.value = this.value + button;
    this.keyboardPressKey.emit(this.value);
  };

  handleShift = () => {
    this.keyboard.setOptions({
      layoutName: this.keyboard.options.layoutName === 'default' ? 'shift' : 'default',
    });
  };

  handleCaps() {
    this.keyboard.setOptions({
      layoutName: this.keyboard.options.layoutName === 'default' ? 'shift' : 'default',
    });
  }

  handleTab() {
    // this.keyboardPressKey.emit(this.value + '\t');
    this.moveFocusToNextInput.emit(true);
    // this.onTab();
  }

  // fix: need to remove in next version
  onTab() {
    const focusableElements = Array.from(
      document.querySelectorAll('input, button, a[href], textarea, select'),
    ).filter((el) => !el.hasAttribute('disabled'));

    const focusedElementIndex = focusableElements.findIndex((el) => document.activeElement === el);

    if (focusedElementIndex > -1) {
      const nextIndex =
        focusedElementIndex === focusableElements.length - 1 ? 0 : focusedElementIndex + 1;
      const nextElement = focusableElements[nextIndex];
      // @ts-ignore
      nextElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
