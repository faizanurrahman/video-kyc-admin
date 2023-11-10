import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuComponent } from '../../../../../_metronic/kt/components';

@Component({
  selector: 'metronic-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metronic-popover.component.html',
  styleUrls: ['./metronic-popover.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetronicPopoverComponent implements AfterViewInit, OnInit {
  @Input() isPermanent: boolean = true;
  @Input({
    alias: 'popoverClasses',
    transform: (popoverClasses: string) => {
      if (!popoverClasses) return ['w-300px', 'w-lg-350px'];
      return popoverClasses.split(' ');
    },
  })
  class: string[];

  @ViewChild('menuElement') menuElement: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // console.log('class', this.class);
    this.class.forEach((className: string) => {
      this.menuElement.nativeElement.classList.add(className);
    });

    this.initializeMenu();
  }

  closePopover() {
    this.menuElement.nativeElement.classList.remove('show');
  }

  initializeMenu() {
    // menuReinitialization();
    setTimeout(() => {
      MenuComponent.reinitialization();
      // DrawerComponent.reinitialization();
      // ToggleComponent.reinitialization();
      // ScrollComponent.reinitialization();
    }, 50);
  }
}
