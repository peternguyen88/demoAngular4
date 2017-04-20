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
      let incorrectQuestions = this.questions.filter((question) => !question.isCorrect());
      if(incorrectQuestions.length > 0){
        this.testScreenService.questions = incorrectQuestions;
        this.testScreenService.reviewQuestion(incorrectQuestions[0]);
      }
    }

    public reviewBookmarked(){
      let bookmarkedQuestions = this.questions.filter((question) => question.bookmarked);
      if(bookmarkedQuestions.length > 0){
        this.testScreenService.questions = bookmarkedQuestions;
        this.testScreenService.reviewQuestion(bookmarkedQuestions[0]);
      }
    }

    public reviewSingleQuestion(question: Question){
      console.log("Review Question: "+ question.question_number);
      this.testScreenService.reviewQuestion(question);
    }
}
