import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-collapsible-content',
  templateUrl: './collapsible-content.component.html',
  styleUrls: ['./collapsible-content.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgStyle,
  ],
})
export class CollapsibleContentComponent implements OnChanges {
  @Input() title: string = '';
  @Input() maxHeight: string = '0px';
  @Input() isExpanded: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isExpanded) {
      this.maxHeight = changes.isExpanded.currentValue ? '10000000000px' : '0px';
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.maxHeight = this.isExpanded ? '10000000000px' : '0px';
  }

  // write a function to toggle the icon
}
