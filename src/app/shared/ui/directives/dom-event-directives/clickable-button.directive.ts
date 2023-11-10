import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickable]',
  standalone: true,
})
export class ClickableDirective {
  @Input() dropShadowColor: string = '#000';
  @Input() clickableDirection: 'vertical' | 'horizontal' = 'vertical';
  @Input() clickableDistance: number = 2; // Change this value to adjust the click effect distance

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.applyRaisedEffect();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.resetEffects();
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.applyPushedEffect();
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.applyRaisedEffect();
  }

  private applyRaisedEffect() {
    const distance =
      this.clickableDirection === 'horizontal'
        ? `${this.clickableDistance}px, 0`
        : `0, -${this.clickableDistance}px`;

    this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${distance})`);
    this.renderer.setStyle(
      this.el.nativeElement,
      'box-shadow',
      `0px 2px 5px ${this.dropShadowColor}`,
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform 0.2s ease, box-shadow 0.2s ease',
    );
  }

  private applyPushedEffect() {
    const distance =
      this.clickableDirection === 'horizontal'
        ? `${this.clickableDistance / 2}px, 0`
        : `0, ${this.clickableDistance / 2}px`;

    this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${distance})`);
    this.renderer.setStyle(
      this.el.nativeElement,
      'box-shadow',
      `0px 1px 3px ${this.dropShadowColor}`,
    );
  }

  private resetEffects() {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.el.nativeElement, 'transition');
  }
}
