import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPasswordVisibility]',
})
export class PasswordVisibilityDirective {
  private _type = 'password';
  private _showPassword = false;

  @Input()
  get type(): string {
    // // console.log('get type', this._type);
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this.renderer.setAttribute(this.el.nativeElement, 'type', this._type);

    // // console.log('set type', this._type);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
