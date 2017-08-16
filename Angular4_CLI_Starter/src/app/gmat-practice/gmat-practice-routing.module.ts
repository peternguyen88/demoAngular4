import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

import {GMATPracticeComponent} from "./gmat-practice.component";
import {GMATPremiumComponent} from "./premium/gmat-premium.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'standard'
  },
  {
    path: 'standard',
    component: GMATPracticeComponent,
    data: {
      title: 'GMAT Practice'
    }
  },
  {
    path: 'premium',
    component: GMATPremiumComponent,
    data: {
      title: 'GMAT Premium Practice'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMATPracticeRoutingModule {}
