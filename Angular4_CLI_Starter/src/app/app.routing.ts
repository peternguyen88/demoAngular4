import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { GmatTimerComponent } from "./gmat-timer/gmat-timer.component";
import {TestScreenComponent} from "./gmat-cat/gmat-cat-test/test-screen/test-screen.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'gmat-cat',
        loadChildren: './gmat-cat/gmat-cat.module#GmatCatModule'
      },
      {
        path: 'gmat-timer',
        component: GmatTimerComponent,
        data:{
          title: 'GMAT Timer'
        }
      },
      {
        path: 'gmat-test',
        component: TestScreenComponent,
        data:{
          title: 'GMAT Test'
        }
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
