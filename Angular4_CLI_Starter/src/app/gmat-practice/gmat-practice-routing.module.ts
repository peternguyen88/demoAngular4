import { NgModule } from '@angular/core';
import {Routes, RouterModule} from "@angular/router";

import {GMATPracticeComponent} from "./gmat-practice.component";
import {GMATPremiumComponent} from "./premium/gmat-premium.component";
import {GMATComprehensiveComponent} from "./comprehensive/gmat-comprehensive.component";
import {GmatQuantitativeComponent} from "./quantitative/gmat-quantitative.component";
import {GmatClubTestComponent} from "./gmatclub-test/gmat-club-test.component";

const routes: Routes = [
  { path: 'standard',    component: GMATPracticeComponent,    data: {      title: 'GMAT Practice'    }  },
  { path: 'standard/:setID',    component: GMATPracticeComponent,    data: {      title: 'GMAT Practice'    },  },
  { path: 'standard/:setID/practice/:questionNoPractice',    component: GMATPracticeComponent,    data: {      title: 'GMAT Practice'    },  },
  { path: 'standard/:setID/review/:questionNoReview',    component: GMATPracticeComponent,    data: {      title: 'GMAT Practice'    },  },

  { path: 'premium',    component: GMATPremiumComponent,    data: {      title: 'GMAT Premium Practice'    }  },
  { path: 'premium/:setID',    component: GMATPremiumComponent,    data: {      title: 'GMAT Premium Practice'    }  },
  { path: 'comprehensive',    component: GMATComprehensiveComponent,    data: {      title: 'GMAT Comprehensive - Student Access Only'    }  },
  { path: 'comprehensive/:setID',    component: GMATComprehensiveComponent,    data: {      title: 'GMAT Comprehensive - Student Access Only'    }  },
  { path: 'quantitative',    component: GmatQuantitativeComponent,    data: {      title: 'GMAT Quantitative'    }  },
  { path: 'quantitative/:setID',    component: GmatQuantitativeComponent,    data: {      title: 'GMAT Quantitative'    }  },
  { path: 'gmat-club-test',    component: GmatClubTestComponent,    data: {      title: 'GMAT Club Test'    }  },
  { path: 'gmat-club-test/:setID',    component: GmatClubTestComponent,    data: {      title: 'GMAT Club Test'    }  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GMATPracticeRoutingModule {}
