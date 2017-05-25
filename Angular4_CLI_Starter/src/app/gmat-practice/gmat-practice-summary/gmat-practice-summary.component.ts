/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";

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

    startPractice(){
      this.practiceService.start();
    }

    startPracticeAt(question: Question){
      let index = this.currentPractice.questions.indexOf(question);
      this.practiceService.startAt(index);
    }

    startReview(){
      this.practiceService.review();
    }

    startReviewAt(question: Question){
      let index = this.currentPractice.questions.indexOf(question);
      this.practiceService.reviewAt(index);
    }

    backToSelection(){
      this.practiceService.backToSelection();
    }
}
