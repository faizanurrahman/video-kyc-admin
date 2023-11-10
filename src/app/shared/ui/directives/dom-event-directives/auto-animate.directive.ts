import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import autoAnimate, { AutoAnimateOptions, AutoAnimationPlugin } from '@formkit/auto-animate';

@Directive({
  selector: '[auto-animate]',
  standalone: true,
})
export class AutoAnimateDirective implements AfterViewInit {
  @Input() options: Partial<AutoAnimateOptions> | AutoAnimationPlugin = {}

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    autoAnimate(this.el.nativeElement, this.options);
  }
}