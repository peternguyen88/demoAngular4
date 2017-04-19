/**
 * Display question summary as well as Time Spent, Correctness of questions
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {GMATTest} from "../../../models/gmat-test";
import {Question} from "../../../models/question";
import {TestMode} from "../../../models/constants.enum";

@Component({
    moduleId: module.id,
    selector: 'test-summary',
    templateUrl: 'test-summary.component.html',
    styleUrls: ['test-summary.component.css']
})
export class TestSummaryComponent {
    currentTest: GMATTest;
    questions: Question[];

    @Output() reviewEvent = new EventEmitter();

    constructor(public testScreenService: TestScreenService) {
      this.currentTest = this.testScreenService.currentTest;
      this.questions = this.testScreenService.currentTest.questions;
    }

    public onBackToSummary(){
      this.testScreenService.backToSummary();
    }

    public reviewAll(){
      this.reviewSingleQuestion(this.questions[0]);
    }

    public reviewIncorrect(){

    }

    public reviewBookmarked(){

    }

    public reviewSingleQuestion(question: Question){
      this.testScreenService.testMode = TestMode.REVIEW;
      this.testScreenService.currentQuestionIndex = question.question_number - 1;
      this.testScreenService.currentQuestionTime = question.question_time;

      console.log("Review Question: "+question.question_number);
      this.switchToReviewMode();
    }

    private switchToReviewMode(){
      // this.reviewEvent.emit();
      this.testScreenService.startReviewMode();
  }
}
