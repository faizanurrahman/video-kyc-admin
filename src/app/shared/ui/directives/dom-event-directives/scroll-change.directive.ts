// scroll-change.directive.ts
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollChange]',
  standalone: true,
})
export class ScrollChangeDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('scroll', [])
  onElementScroll() {
    const scrollPosition = this.elementRef.nativeElement.scrollTop;

    // console.log('scroll position', scrollPosition);

    // Update the CSS class based on the scroll position
    if (scrollPosition > 100) {
      this.renderer.addClass(this.elementRef.nativeElement, 'scrolled');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'scrolled');
    }
  }
}
