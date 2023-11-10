import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { LottieAnimationComponent } from '@shared/ui/components/lottie-animation/lottie-animation.component';

export interface WizardStep {
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  stepStatus: 'valid' | 'invalid' | 'disabled';
  stepState: 'current' | 'done' | 'pending' | 'error';
  progress: number;
}

@Component({
  selector: 'app-wizard-steps',
  standalone: true,
  imports: [CommonModule, LottieAnimationComponent],
  templateUrl: './wizard-steps.component.html',
  styleUrls: ['./wizard-steps.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class WizardStepsComponent {
  @Input() steps: WizardStep[] = [];
  @Input() currentStep: number = 1;
  @Input() clickableStepCount: number = 0;

  @Output() currentStepChange: EventEmitter<number> = new EventEmitter();

  onStepClick(index: number) {
    if (index + 1 <= this.clickableStepCount) {
      this.currentStepChange.emit(index + 1);
    }
  }
}
