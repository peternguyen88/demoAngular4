import {NgModule} from "@angular/core";
import {DigitalTimeDirective} from "../../directives/gm-digital-time.directive";
/**
 * This module will be imported by other modules
 */
@NgModule({
  declarations: [DigitalTimeDirective],
  exports: [DigitalTimeDirective]
})
export class GmatCommonModule{}
