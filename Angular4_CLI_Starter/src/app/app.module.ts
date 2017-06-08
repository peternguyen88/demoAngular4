import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

import {AppComponent} from "./app.component";
import {DropdownModule} from "ng2-bootstrap/dropdown";
import {TabsModule} from "ng2-bootstrap/tabs";
import {NAV_DROPDOWN_DIRECTIVES} from "./shared/nav-dropdown.directive";

import {ChartsModule} from "ng2-charts/ng2-charts";
import {SIDEBAR_TOGGLE_DIRECTIVES} from "./shared/sidebar.directive";
import {AsideToggleDirective} from "./shared/aside.directive";
import {BreadcrumbsComponent} from "./shared/breadcrumb.component";
// Routing Module
import {AppRoutingModule} from "./app.routing";
//Layouts
import {FullLayoutComponent} from "./layouts/full-layout.component";
import {GmatTimerComponent} from "./gmat-timer/gmat-timer.component";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TimerService} from "./services/gmat-timer.service";
import {FormsModule} from "@angular/forms";
import {GmatCommonModule} from "./shared/modules/GmatCommonModule";
import {AngularFireModule} from "angularfire2";

export const firebaseConfig = {
  apiKey: "AIzaSyAa4rCwsgsFfuKtAtjcRe3tS6cBs0KLsbg",
  authDomain: "gmat-zero-to-hero.firebaseapp.com",
  databaseURL: "https://gmat-zero-to-hero.firebaseio.com",
  projectId: "gmat-zero-to-hero",
  storageBucket: "gmat-zero-to-hero.appspot.com",
  messagingSenderId: "227562885868"
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpModule,
    FormsModule,
    GmatCommonModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,

    // Custom Components
    GmatTimerComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, TimerService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
