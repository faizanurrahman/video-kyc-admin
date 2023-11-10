import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { Country, ICountry } from 'country-state-city';

// export type CountryGroup = CountryCode & { subgroup?: string };
export interface CountryGroup extends ICountry {
  subgroup: string;
}

@Component({
  selector: 'app-tel-country-code',
  standalone: true,

  templateUrl: './tel-country-code.component.html',
  styleUrls: ['./tel-country-code.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TelCountryCodeComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TelCountryCodeComponent),
      multi: true,
    },
  ],
})
export class TelCountryCodeComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  // private countries: CountryCode[] = CountriesCodes;
  private countries: ICountry[] = [];
  public countryGroups: CountryGroup[] = [];

  public formControl: FormControl = new FormControl();

  private onChange: (value: any) => void;
  private onTouched: () => void;

  writeValue(value: any): void {
    // Write Value will be called when value is set from parent component
    // Disable emitEvent to prevent infinite loop
    this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // Register onChange function for parent component
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Set disable state for form control
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  validate(control: FormControl): { [key: string]: any } | null {
    // Validate function will be called when form is submitted
    // Return null if form is valid
    // Return object if form is invalid
    return null;
  }

  constructor(private destroyRef: DestroyRef) {
    this.countries = Country.getAllCountries();
    this.countryGroups = this.countries.map((c) => {
      return {
        ...c,
        subgroup: c.name === 'Botswana' ? 'Default' : 'Other Country',
        phonecode: c.phonecode.replace('+', '').replace(' ', ''),
      };
    });

    this.countryGroups = this.countryGroups.sort((a, b) => a.subgroup.localeCompare(b.subgroup));
  }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this.onChange) {
        this.onChange(value);
      }

      if (this.onTouched) {
        this.onTouched();
      }
    });
  }

  ngOnDestroy(): void {}
}
