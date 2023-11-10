import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input.component';
import { FormControlComponent } from './form-control/form-control.component';



@NgModule({
  declarations: [
    InputComponent,
    FormControlComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [InputComponent],
})
export class InputModule { }
