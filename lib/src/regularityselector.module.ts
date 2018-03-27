
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RegularitySelectorComponent } from './regularityselector.component';
import { RegularitySelectorDirective } from './regularityselector.directive';
import { RegularitySelectorControl } from './regularityselector.control';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    RegularitySelectorComponent,
    RegularitySelectorDirective,
    RegularitySelectorControl
  ],
  entryComponents: [
    RegularitySelectorComponent
  ],  
  exports: [
    RegularitySelectorComponent,
    RegularitySelectorDirective,
    RegularitySelectorControl
  ]
})
export class RegularitySelectorModule { }
