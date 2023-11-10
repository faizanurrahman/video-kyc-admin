import { ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { CaptchaModel, CaptchaModelResponse } from '../models/captcha.model';
import { CaptchaService } from '../services/captcha.service';

@Component({
  selector: 'app-registration-captcha',
  templateUrl: './registration-captcha.component.html',
  styleUrls: ['./registration-captcha.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RegistrationCaptchaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RegistrationCaptchaComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule],
})
export class RegistrationCaptchaComponent implements ControlValueAccessor, Validator {
  captcha: CaptchaModel = new CaptchaModel();

  private _innerValue: string;
  private _disabled: boolean;

  // Event emitters for the control
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  get value(): string {
    return this._innerValue;
  }

  set value(v: string) {
    if (v !== this._innerValue) {
      this._innerValue = v;
      this.onChangeCallback(v);
    }
  }

  constructor(private captchaService: CaptchaService, private cdr: ChangeDetectorRef) {
    this.captchaService.getCaptchaChallenge().then((res: CaptchaModelResponse) => {
      // // console.log(
      //   '%c captcha response model, on captcha constructor',
      //   'font-size: 2rem; color: red;',
      //   res
      // );
      this.captcha.captchaImage = res.data.CAPTCHA_IMG_DATA;

      // Get the canvas element and its context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Load the image into the canvas
      let img = document.getElementById('captcha-image')! as HTMLImageElement;
      //
      img.src = this.captcha.captchaImage;

      img.onload = function () {
        // set the canva size to match the image

        canvas.width = img.width;
        canvas.height = img.height;

        // // console.log('width: ', img.width);
        // // console.log('height', img.height);

        ctx.drawImage(img, 0, 0);

        // Apply the image processing filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        // // console.log('image data', data);

        // Manipulate the pixel data as needed
        for (let i = 0; i < data.length; i += 4) {
          // Example: Invert the colors of the image
          data[i] = 255 - data[i]; // red
          data[i + 1] = 255 - data[i + 1]; // green
          data[i + 2] = 255 - data[i + 2]; // blue
          // data[i] = 0;
          // data[i + 1] = 0;
          // data[i + 2] = 0;
          // Calculate the grayscale value of the pixel
          const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
          //
          // // Set the red, green, and blue channels of the pixel to the background color
          data[i] = 0; // red
          data[i + 1] = 0; // green
          data[i + 2] = 0; // blue
          //
          // // Set the alpha channel of the pixel to its grayscale value
          data[i + 3] = grayscale;
          //
          // // Adjust the text color to a light brown
          if (grayscale < 128) {
            // data[i] = 133; // red
            // data[i+1] = 43; // green
            // data[i+2] = 0; // blue
          }
        }

        // Put the modified pixel data back into the canvas
        ctx.putImageData(imageData, 0, 0);

        // Apply the CSS filter to the canvas
        canvas.style.filter = 'sepia(100%) hue-rotate(-15deg) brightness(0.9) saturate(1.2)';

        // Set the src attribute of the image to the canvas data URL
        // img.src = canvas.toDataURL();

        // .detectChanges();

        const newImg = new Image();
        newImg.src = canvas.toDataURL();

        img.classList.add('d-none');
        newImg.classList.add('h-75px', 'w-100', 'bgi-no-repeat');

        const captchaImageContainer = document.querySelector(
          '#captcha-image-container',
        )! as HTMLElement;

        const children = captchaImageContainer.children;
        for (let i = 0; i < children.length; i++) {
          captchaImageContainer.removeChild(children[i]);
        }
        captchaImageContainer.appendChild(newImg);
      };

      this.cdr.detectChanges();
    });
  }

  writeValue(value: any): void {
    if (value !== this._innerValue) {
      this._innerValue = value;
      this.onChangeCallback(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  validate(c: AbstractControl) {
    if (c.value == null || c.value === '') {
      return { required: true };
    }
    // // console.log('abstract control: ', c);
    return null;
  }

  public async refereshCaptcha() {
    // // console.log(
    //   '%c Captcha referesh clicked',
    //   'font-size: 2rem; color: green;'
    // );
    const captchaResponse = await this.captchaService.getCaptchaChallenge();

    // // console.log(
    //   '%c On Referesh We Got the captcha',
    //   'font-size: 2rem; color: blue',
    //   captchaResponse
    // );

    this.captcha.captchaImage = captchaResponse.data.CAPTCHA_IMG_DATA;
  }
}
