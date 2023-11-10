import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lottie-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lottie-animation.component.html',
  styleUrls: ['./lottie-animation.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LottieAnimationComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) animationPath: string;
  @Input({ required: false }) animationDirection: 1 | -1 = 1;
  @Input({ required: false }) animationLoop: boolean = false;
  @Input({ required: false }) animationAutoplay: boolean = false;
  @Input({ required: false }) animationName: string = '';
  @Input({ required: false }) animationSpeed: number = 1;
  @Input({ required: false }) play: boolean | undefined = undefined;
  @Input({ required: false }) animationToggle: boolean | undefined = undefined;
  @Input({ required: false }) pause: boolean | undefined = undefined;
  @Input({ required: false }) reverse: boolean | undefined = undefined;

  @Input({ required: false }) destroyAnimation: boolean = false;

  hostColor: string = 'black';

  constructor(private el: ElementRef) {
    this.hostColor = (this.el.nativeElement as HTMLDivElement).style.color;
    // console.log('Element: ', this.el.nativeElement);
    // console.log('host color is: ', this.hostColor);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!this.animationItem) return;

    if (simpleChanges.animationToggle) {
      if (simpleChanges.animationToggle.currentValue) {
        this.playAnimation();
      } else {
        this.pauseAnimation();
      }
    }

    if (simpleChanges.play) {
      if (simpleChanges.play.currentValue) {
        this.playAnimation();
      }
    }

    if (
      simpleChanges.pause &&
      simpleChanges.pause.currentValue !== simpleChanges.pause.previousValue
    ) {
      if (simpleChanges.pause.currentValue) {
        this.pauseAnimation();
      }
    }

    if (
      simpleChanges.reverse &&
      simpleChanges.reverse.currentValue !== simpleChanges.reverse.previousValue
    ) {
      if (simpleChanges.reverse.currentValue) {
        this.reverseAnimation();
      }
    }

    if (simpleChanges.destroyComponent && simpleChanges.destroyComponent.currentValue) {
      this.animationItem.destroy();
    }
  }

  @Output() destroy: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('lottieContainer', { static: true }) lottieContainer: ElementRef;
  private animationItem: AnimationItem;

  ngOnInit() {
    this.loadLottieAnimation();
    if (this.play) {
      this.playAnimation();
    }

    if (!this.play && this.pause) {
      this.pauseAnimation();
    }

    if (this.reverse) {
      this.reverseAnimation();
    }

    this.animationItem.addEventListener('DOMLoaded', () => {
      this.animationItem.setSpeed(this.animationSpeed);
      this.lottieContainer.nativeElement.querySelector('svg').classList.add('lottie-icon');
      const svg = this.lottieContainer.nativeElement.querySelector('svg');
      const paths = svg.querySelectorAll('path');
      paths.forEach((path: any) => {
        // path.setAttribute('stroke', this.hostColor || 'currentColor');
        path.setAttribute('stroke-width', '8');
      });
    });

    // this.animationItem.addEventListener('segmentStart', () => {
    //   const svg = this.lottieContainer.nativeElement.querySelector('svg');
    //   const paths = svg.querySelectorAll('path');
    //   paths.forEach((path: any) => {
    //     path.setAttribute('stroke', this.hostColor || 'currentColor');
    //     path.setAttribute('stroke-width', '8');
    //   });
    // });
  }

  loadLottieAnimation() {
    const animationPath = this.animationPath; // Update with the correct path to the JSON file
    this.animationItem = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: this.animationLoop,
      autoplay: this.animationAutoplay, // Set autoplay to false
      path: animationPath,
    });

    this.animationItem.setDirection(this.animationDirection); // Set animation direction to forward
    this.animationItem.playSpeed = this.animationSpeed;

    this.animationItem.addEventListener('destroy', () => {
      this.destroy.emit(true);
    });
  }

  playAnimation() {
    this.animationItem.setDirection(1); // Set animation direction to forward
    this.animationItem.goToAndStop(0); // Go to the first frame and play
    this.animationItem.play(); // Play the animation when needed
  }

  pauseAnimation() {
    this.animationItem.pause(); // Pause the animation when needed
  }

  reverseAnimation() {
    this.animationItem.setDirection(-1); // Reverse the animation
    this.animationItem.goToAndStop(100);
    this.animationItem.play(); // Play the animation again
  }

  ngOnDestroy() {
    this.animationItem.destroy();
  }
}
