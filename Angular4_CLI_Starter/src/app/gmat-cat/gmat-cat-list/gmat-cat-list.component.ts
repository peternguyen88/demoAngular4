/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {GMATTest} from "../../models/gmat-test";
import {GMATTestService} from "../../services/gmat-test.service";
import {TestScreenService} from "../services/gmat-test-screen.service";

@Component({
    moduleId: module.id,
    selector: 'gmat-cat-list',
    templateUrl: 'gmat-cat-list.component.html'
})
export class GmatCatListComponent {
    tests : GMATTest[];

    constructor(private testScreenService: TestScreenService) {
      this.tests = GMATTestService.getAllTests();
    }

    public selectTest(test : GMATTest){
      console.log("Select Test "+ test.testName);
      this.testScreenService.setCurrentTest(test);
    }

    public unlockTest(test : GMATTest){
      console.log("Unlock Test");
    }
}
