import {Component} from "@angular/core";
import {GMATTest} from "../models/gmat-test";
/**
 * Main Component for taking GMAT CAT
 */
@Component({
  templateUrl: 'gmat-cat.component.html'
})
export class GmatCatComponent{
  currentTest: GMATTest;

  setCurrentTest(test : GMATTest) : void {
    this.currentTest = test;
  }
}
