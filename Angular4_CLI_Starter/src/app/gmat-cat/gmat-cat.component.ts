import {Component, OnInit} from "@angular/core";
import {GMATTest} from "../models/gmat-test";
import {TestScreenService} from "./services/gmat-test-screen.service";
/**
 * Main Component for taking GMAT CAT
 */
@Component({
  templateUrl: 'gmat-cat.component.html'
})
export class GmatCatComponent{

  constructor(private testScreenService : TestScreenService){}

  getCurrentTest() : GMATTest {
    return this.testScreenService.currentTest;
  }
}
