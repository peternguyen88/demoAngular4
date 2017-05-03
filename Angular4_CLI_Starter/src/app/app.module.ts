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
import {DigitalTimeDirective} from "./directives/gm-digital-time.directive";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,

    // Custom Components
    GmatTimerComponent,
    DigitalTimeDirective
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, TimerService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
