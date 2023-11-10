import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wizard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard-content.component.html',
  styleUrls: ['./wizard-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class WizardContentComponent {}
