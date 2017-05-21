import {Injectable, OnInit} from "@angular/core";
import {Stage} from "../data/Model";
import {GMATPractice} from "../../models/gmat-practice";
import {Http} from "@angular/http";
import {PracticeData} from "../data/practice-sets";
import {PracticeMode} from "../../models/constants.enum";
import {Subscription} from "rxjs/Subscription";
import {Question} from "../../models/question";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PracticeService{
  currentPractice: GMATPractice;

  constructor(private http:Http){}

  //========================================Render Control ===================================================
  stage: Stage = Stage.SELECT;

  public selectPracticeSet(practiceSet: GMATPractice){
    this.currentPractice = practiceSet;
    // Load Questions from Server
    this.http.get(this.currentPractice.fileLocation).subscribe(response =>{
      if(response.ok) {
        PracticeData.processQuestionFile(this.currentPractice, response.text());
      }
    });
    //===========================
    this.stage = Stage.SUMMARY;
  }

  public backToSummary(){
    this.stage = Stage.SUMMARY;
  }

  public startPractice(){
    this.stage = Stage.PRACTICE;
  }

  public backToSelection(){
    this.stage = Stage.SELECT;
  }

  //========================================End Render Control ===============================================

  //===================================== Practice Control ===================================================
  // -------------Control variables----------------
  practiceMode: PracticeMode = PracticeMode.PRACTICE;
  questions: Question[];

  isStarted : boolean;
  isPaused : boolean;
  elapsedTime: number;

  currentQuestionIndex : number;
  currentQuestionTime : number = 0;

  subscription : Subscription;
  // -------------End Control variables------------

  // -------------Control Functions----------------
  start(){
    this.startAt(0);
  }

  startAt(index: number){
    this.startPractice();

    this.isStarted = true;
    this.isPaused = false;
    this.currentQuestionTime = 0;
    this.currentQuestionIndex = index;
    this.elapsedTime = 0;
    this.practiceMode = PracticeMode.PRACTICE;
    this.questions = this.currentPractice.questions;
    this.clearSelectedAnswer();
    this.subscribe();
  }

  pauseOrResume(){
    this.isPaused = !this.isPaused;
    if(this.isPaused){
      this.unSubscribe();
    }else{
      this.subscribe();
    }
  }

  end(){
    if(this.practiceMode == PracticeMode.PRACTICE){
      this.endPractice();
    }else{
      this.endReview();
    }
  }

  endPractice(){
    // UnSubscribe
    this.unSubscribe();
    // Save practice
    this.savePracticeData();
    // Back to summary
    this.backToSummary();
  }

  review(){
    this.startPractice();

    this.practiceMode = PracticeMode.REVIEW;
    this.currentQuestionIndex = 0;
    this.questions = this.currentPractice.questions;
  }

  endReview(){
    this.backToSummary();
  }

  updateEachSecond(){
    this.currentQuestionTime++;
    this.elapsedTime++;
  }

  savePracticeData(){

  }

  // ------------- Navigation -------------------------
  next(){
    if(!this.isLastQuestion()){
      // Save Question Time
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
      // Move to the next question
      this.currentQuestionIndex++;
      this.currentQuestionTime = this.getCurrentQuestion().question_time;
    }
  }

  prev(){
    if(!this.isFirstQuestion()){
      // Save Question Time
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
      // Move back to previous question
      this.currentQuestionIndex--;
      this.currentQuestionTime = this.getCurrentQuestion().question_time;
    }
  }

  getCurrentQuestion():Question{
    return this.questions[this.currentQuestionIndex];
  }

  // ------------- Subscription -----------------------
  subscribe(){
    this.subscription = Observable.interval(1000).subscribe(res => {
      this.updateEachSecond();
    });
  }

  unSubscribe(){
    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // -------------End Control Functions------------

  // ==================================== End Practice Control ===============================================

  // ==================================== Util Functions =====================================================
  clearSelectedAnswer(){
    this.questions.forEach(e => {
      e.selected_answer = null;
      e.question_time = 0;
    });
  }

  isFirstQuestion():boolean{
    return this.currentQuestionIndex == 0;
  }

  isLastQuestion():boolean{
    return this.currentQuestionIndex == this.questions.length - 1;
  }
}
