
import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { RegularitySelectorDirective } from './regularityselector.directive';

@Component({
  selector: 'app-regularityselector-input',
  template: `{{_value.toLocaleString()}}`,
  styles: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RegularitySelectorControl),
    multi: true
    }
  ]
})
export class RegularitySelectorControl extends RegularitySelectorDirective {

  //Set touched on blur
  //onBlur() {
  //  this.onTouchedCallback();
  //}   
  
}
