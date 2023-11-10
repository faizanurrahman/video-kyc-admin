import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICreateAccount } from '../../create-account.helper';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  standalone: true,
  imports: [
    NgbTooltip,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
  ],
})
export class Step1Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<ICreateAccount>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<ICreateAccount>;
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.updateParentModel({}, true);
  }

  initForm() {
    this.form = this.fb.group({
      accountType: [this.defaultValues.accountType, [Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe(val => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
  }
}
