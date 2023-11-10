import { NgModule } from '@angular/core';
import { EmailValidatorDirective } from './email-validator.directive';
import { MobileNumberValidatorDirective } from './mobile-number-validator.directive';
import { PasswordValidatorDirective } from './password-validator.directive';
import { TelephoneNumberValidatorDirective } from './telephone-number-validator.directive';

@NgModule({
  declarations: [
    EmailValidatorDirective,
    TelephoneNumberValidatorDirective,
    MobileNumberValidatorDirective,
    PasswordValidatorDirective,
  ],
  imports: [],
  exports: [
    EmailValidatorDirective,
    TelephoneNumberValidatorDirective,
    MobileNumberValidatorDirective,
    PasswordValidatorDirective,
  ],
  providers: [],
})
export class ValidatorDirectivesModule {}
