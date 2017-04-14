/**
 * Display question summary as well as Time Spent, Correctness of questions
 */
import {Component} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {GMATTest} from "../../../models/gmat-test";
import {Question} from "../../../models/question";

@Component({
    moduleId: module.id,
    selector: 'test-summary',
    templateUrl: 'test-summary.component.html'
})
export class TestSummaryComponent {
    currentTest: GMATTest;
    questions: Question[];
    constructor(public testScreenService: TestScreenService) {
      this.currentTest = this.testScreenService.currentTest;
      this.questions = this.testScreenService.currentTest.questions;
    }
}
