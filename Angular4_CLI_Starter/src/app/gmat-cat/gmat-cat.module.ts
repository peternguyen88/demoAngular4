/**
 * Create a separate Module for GMAT CAT
 */
import {NgModule} from "@angular/core";
import {GmatCatComponent} from "./gmat-cat.component";
import {GmatCatRoutingModule} from "./gmat-cat-routing.module";
import {GmatCatTestComponent} from "./gmat-cat-test/gmat-cat-test.component";
import {GmatCatListComponent} from "./gmat-cat-list/gmat-cat-list.component";

@NgModule({
  imports: [GmatCatRoutingModule],
  declarations: [GmatCatComponent,
    GmatCatTestComponent,
    GmatCatListComponent
  ],
})

export class GmatCatModule {
}
