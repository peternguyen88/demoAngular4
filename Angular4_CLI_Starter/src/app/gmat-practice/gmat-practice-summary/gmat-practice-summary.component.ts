/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";
import {forEach} from "@angular/router/src/utils/collection";
import {Http} from "@angular/http";

@Component({
    moduleId: module.id,
    selector: 'gmat-practice-summary',
    templateUrl: 'gmat-practice-summary.component.html'
})
export class GMATPracticeSummaryComponent {
    currentPractice: GMATPractice;
    resumable: boolean = true;

    isShowingCustomPage:boolean = false;
    customPageContent:string;

    constructor(private http:Http, private practiceService: PracticeService) {
      this.currentPractice = practiceService.currentPractice;
      this.resumable = this.currentPractice.questions.length != this.getUnansweredQuestionIndex();
    }

    startPractice(){
      this.practiceService.start();
    }

    resumePractice(){
      if(this.resumable) {
        this.practiceService.resume(this.getUnansweredQuestionIndex());
      }
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
      if(this.isShowingCustomPage){
        this.isShowingCustomPage = false;
      }
      else {
        this.practiceService.backToSelection();
      }
    }

    getUnansweredQuestionIndex(): number{
      let index = 0;
      for(let question of this.currentPractice.questions){
        if(!question.selected_answer) break;
        index++;
      }
      return index;
    }

    showCustomPage(linkToPage){
      this.http.get('assets/pages/'+linkToPage).subscribe(response => {
        this.isShowingCustomPage = true;
        this.customPageContent = response.text();
      });
    }
}
