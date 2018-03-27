import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RegularitySelectorModule } from 'asu-regularityselector';
import { RegularitySelectorComponent } from 'asu-regularityselector';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RegularitySelectorModule,
  ],
  providers: [],
  entryComponents: [RegularitySelectorComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
