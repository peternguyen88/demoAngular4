import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import * as $ from 'jquery';

// Declare ga function as ambient
declare var ga: Function;

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  isActive: boolean = true;

  constructor(public router: Router) {
    // Check if current tab is active
    const self = this;
    $(window).blur(function () {
      self.isActive = false;
    });
    $(window).focus(function () {
      self.isActive = true;
    });

    router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      console.log('router.change', x);
      ga('set', 'page', x.url);
      ga('send', 'pageview');
    });

    setInterval(function () {
      if (self.isActive) ga('send', 'pageview');
    }, 60000 * 10);
  }
}
