/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";

@Component({
    moduleId: module.id,
    selector: 'gmat-practice-summary',
    templateUrl: 'gmat-practice-summary.component.html'
})
export class GMATPracticeSummaryComponent {
    currentPractice: GMATPractice;

    constructor(private practiceService: PracticeService) {
      this.currentPractice = practiceService.currentPractice;
    }
}
