import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SplashScreenService} from './splash-screen.service';
import {LoaderComponent} from '../../../../shared/ui/components/loader/loader.component';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  imports: [LoaderComponent],
})
export class SplashScreenComponent implements OnInit {
    @ViewChild('splashScreen', {static: true}) splashScreen: ElementRef;

    constructor(private splashScreenService: SplashScreenService) {
    }

    ngOnInit(): void {
      this.splashScreenService.init(this.splashScreen);
    }
}
