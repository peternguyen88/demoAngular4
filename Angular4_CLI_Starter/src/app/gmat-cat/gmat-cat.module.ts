/**
 * Create a separate Module for GMAT CAT
 */
import {NgModule} from "@angular/core";
import {GmatCatComponent} from "./gmat-cat.component";
import {GmatCatRoutingModule} from "./gmat-cat-routing.module";
import {GmatCatTestComponent} from "./gmat-cat-test/gmat-cat-test.component";
import {GmatCatListComponent} from "./gmat-cat-list/gmat-cat-list.component";
import {CommonModule} from "@angular/common";
import {GMATTestService} from "../services/gmat-test.service";
import {TestWelcomeScreenComponent} from "./gmat-cat-test/test-welcome-screen/test-welcome-screen.component";
import {SafeHtmlPipe, TestScreenComponent} from "./gmat-cat-test/test-screen/test-screen.component";
import {TestScreenService} from "./services/gmat-test-screen.service";
import {FormsModule} from "@angular/forms";
import {TestSummaryComponent} from "./gmat-cat-test/test-summary-screen/test-summary.component";
import {GmatCommonModule} from "../shared/modules/GmatCommonModule";

@NgModule({
  imports: [CommonModule, GmatCommonModule,
    GmatCatRoutingModule, FormsModule],
  declarations: [GmatCatComponent,
    GmatCatTestComponent,
    GmatCatListComponent,
    TestWelcomeScreenComponent,
    TestScreenComponent,
    SafeHtmlPipe,
    TestSummaryComponent
  ],
  providers: [GMATTestService, TestScreenService]
})

export class GmatCatModule {
}
