/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {GMATTest} from "../../models/gmat-test";
import {GMATTestService} from "../../services/gmat-test.service";

@Component({
    moduleId: module.id,
    selector: 'gmat-cat-list',
    templateUrl: 'gmat-cat-list.component.html'
})
export class GmatCatListComponent {
    tests : GMATTest[];
    @Output() testSelected = new EventEmitter();

    constructor(testService : GMATTestService) {
      this.tests = testService.getAllTests();
    }

    public selectTest(test : GMATTest){
      console.log("Select Test "+ test.testName);
      this.testSelected.emit(test);
    }

    public unlockTest(test : GMATTest){
      console.log("Unlock Test");
    }
}
