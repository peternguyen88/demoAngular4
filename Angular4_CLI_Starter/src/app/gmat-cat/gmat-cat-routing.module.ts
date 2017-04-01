import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

import {GmatCatComponent} from "./gmat-cat.component";

const routes: Routes = [
  {
    path: '',
    component: GmatCatComponent,
    data: {
      title: 'GMAT Test'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmatCatRoutingModule {}
