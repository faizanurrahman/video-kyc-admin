import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VirtualKeyboardService {
  private isKeyboardVisibleSubject = new BehaviorSubject<boolean>(false);
  private pressedKeySubject = new Subject<string>();

  isKeyboardVisible$: Observable<boolean> = this.isKeyboardVisibleSubject.asObservable();

  get isKeyboardVisible(): boolean {
    return this.isKeyboardVisibleSubject.getValue();
  }
  pressedKey$: Observable<string> = this.pressedKeySubject.asObservable();

  toggleKeyboard(isVisible: boolean) {
    this.isKeyboardVisibleSubject.next(isVisible);
  }

  keyPress(key: string) {
    this.pressedKeySubject.next(key);
  }

  private focusedInputElement: HTMLInputElement | null = null;
  public allFocusableElement: HTMLInputElement[] = [];

  setFocusedInputElement(element: HTMLInputElement | null) {
    this.focusedInputElement = element;
  }

  getFocusedInputElement(): HTMLInputElement | null {
    return this.focusedInputElement;
  }

  getNextFocusElement(): HTMLInputElement | null {
    let index = this.allFocusableElement.indexOf(this.focusedInputElement!);

    if (index === -1) return null;

    return this.allFocusableElement[(index + 1) % this.allFocusableElement.length];
  }
}
