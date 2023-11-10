import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickableSvg]',
  standalone: true,
})
export class ClickableSvgDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.classList.add('raised');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.classList.remove('raised');
  }

  @HostListener('mousedown')
  onMouseDown() {
    this.el.nativeElement.classList.add('pushed');
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.el.nativeElement.classList.remove('pushed');
  }
}
