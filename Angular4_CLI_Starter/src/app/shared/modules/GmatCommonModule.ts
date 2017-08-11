import {NgModule} from "@angular/core";
import {DigitalTimeDirective} from "../../directives/gm-digital-time.directive";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
/**
 * This module will be imported by other modules
 */
@NgModule({
  imports:[CommonModule, FormsModule],
  declarations: [DigitalTimeDirective, ConfirmDialogComponent],
  exports: [DigitalTimeDirective, ConfirmDialogComponent]
})
export class GmatCommonModule{}
