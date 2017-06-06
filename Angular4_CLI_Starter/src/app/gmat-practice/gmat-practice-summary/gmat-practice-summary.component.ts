/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";
import {forEach} from "@angular/router/src/utils/collection";

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

    resumePractice(){
      this.practiceService.startAt(this.getUnansweredQuestionIndex());
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

    getUnansweredQuestionIndex(): number{
      let index = 0;
      for(let question of this.currentPractice.questions){
        if(!question.selected_answer) break;
        index++;
      }
      return index;
    }
}
