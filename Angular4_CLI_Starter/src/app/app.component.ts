import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

// Declare ga function as ambient
declare var ga: Function;

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(public router: Router) {
    router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      console.log('router.change', x);
      ga('send', 'pageview', x.url);
    });
  }
}
