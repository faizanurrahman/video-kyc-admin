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
import { CountryGroup } from '@shared/ui/components/tel-country-code/tel-country-code.component';
import { Country, ICountry } from 'country-state-city';

@Component({
  selector: 'app-country-dropdown',
  standalone: true,

  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryDropdownComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CountryDropdownComponent),
      multi: true,
    },
  ],
})
export class CountryDropdownComponent
  implements OnInit, ControlValueAccessor, Validator, OnDestroy
{
  private countries: ICountry[] = Country.getAllCountries();
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
    this.countryGroups = this.countries.map((c) => {
      return {
        ...c,
        subgroup: c.name === 'Botswana' ? 'Default' : 'Other Country',
        phonecode: c.phonecode.replace('+', '').replace(' ', ''),
      };
    });

    this.countryGroups = this.countryGroups.sort((a, b) => {
      return a.subgroup.localeCompare(b.subgroup);
    });
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
