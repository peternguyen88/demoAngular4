import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

import {GMATPracticeComponent} from "./gmat-practice.component";

const routes: Routes = [
  {
    path: '',
    component: GMATPracticeComponent,
    data: {
      title: 'GMAT Practice'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMATPracticeRoutingModule {}
