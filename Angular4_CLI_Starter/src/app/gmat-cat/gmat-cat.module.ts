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
import {TestScreenComponent} from "./gmat-cat-test/test-screen/test-screen.component";

@NgModule({
  imports: [CommonModule,
    GmatCatRoutingModule],
  declarations: [GmatCatComponent,
    GmatCatTestComponent,
    GmatCatListComponent,
    TestWelcomeScreenComponent,
    TestScreenComponent
  ],
  providers: [GMATTestService]
})

export class GmatCatModule {
}
