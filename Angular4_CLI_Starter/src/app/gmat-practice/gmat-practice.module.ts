/**
 * Create a separate Module for GMAT Practice
 */
import {NgModule} from "@angular/core";
import {GMATPracticeRoutingModule} from "./gmat-practice-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GmatCommonModule} from "../shared/modules/GmatCommonModule";
import {GMATPracticeComponent} from "./gmat-practice.component";
import {PracticeService} from "./services/gmat-practice.service";
import {GMATPracticeListComponent} from "./gmat-practice-list/gmat-practice-list.component";
import {GMATPracticeSummaryComponent} from "./gmat-practice-summary/gmat-practice-summary.component";
import {PracticeScreenComponent, SafeHtmlPipe} from "./practice-screen/practice-screen.component";

@NgModule({
  imports: [CommonModule, GmatCommonModule,
    GMATPracticeRoutingModule, FormsModule],
  declarations: [GMATPracticeComponent, GMATPracticeListComponent, GMATPracticeSummaryComponent, PracticeScreenComponent, SafeHtmlPipe],
  providers: [PracticeService]
})

export class GMATPracticeModule {
}
