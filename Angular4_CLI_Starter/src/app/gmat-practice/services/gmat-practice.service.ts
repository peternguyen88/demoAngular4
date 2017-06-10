import {Injectable, OnInit} from "@angular/core";
import {Stage} from "../data/Model";
import {GMATPractice} from "../../models/gmat-practice";
import {Http} from "@angular/http";
import {PracticeData} from "../data/practice-sets";
import {PracticeMode} from "../../models/constants.enum";
import {Subscription} from "rxjs/Subscription";
import {Question} from "../../models/question";
import {Observable} from "rxjs/Observable";
import {PracticeResult} from "../../models/test-result";
import {FirebaseService} from "../../services/firebase.service";

@Injectable()
export class PracticeService{
  currentPractice: GMATPractice;

  constructor(private http:Http, private fbService: FirebaseService){}

  //========================================Render Control ===================================================
  stage: Stage = Stage.SELECT;

  public selectPracticeSet(practiceSet: GMATPractice){
    this.currentPractice = practiceSet;
    // Try to load from Session Storage
    if(sessionStorage.getItem(this.currentPractice.practiceName)){
      PracticeData.processQuestionFile(this.currentPractice, sessionStorage.getItem(this.currentPractice.practiceName));
      this.loadSavedData();
    }
    else {
      // Load Questions from Server
      this.http.get(this.currentPractice.fileLocation).subscribe(response => {
        if (response.ok) {
          PracticeData.processQuestionFile(this.currentPractice, response.text());
          this.loadSavedData();
          // Save to Session Storage for next time use
          sessionStorage.setItem(this.currentPractice.practiceName, response.text());
        }
      });
    }
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
    // Save Question Time
    if(this.getCurrentQuestion().selected_answer) {
      this.getCurrentQuestion().question_time = this.currentQuestionTime;
    }
    // UnSubscribe
    this.unSubscribe();
    // Save practice
    this.savePracticeData();
    // Back to summary
    this.backToSummary();
  }

  review(){
    this.reviewAt(0);
  }

  reviewAt(index: number){
    this.startPractice();

    this.practiceMode = PracticeMode.REVIEW;
    this.currentQuestionIndex = index;
    this.questions = this.currentPractice.questions;
  }

  endReview(){
    this.backToSummary();
  }

  updateEachSecond(){
    this.currentQuestionTime++;
    this.elapsedTime++;
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

  // =============================Save data to Local Storage & Server==========================
  savePracticeData(){
    let practiceResult;

    if(localStorage.getItem(this.currentPractice.practiceName)){
      let savedResult = JSON.parse(localStorage.getItem(this.currentPractice.practiceName)) as PracticeResult;
      PracticeResult.mergeResult(savedResult, this.currentPractice);
      PracticeResult.mergeResultToPractice(this.currentPractice, savedResult);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(savedResult));
      practiceResult = savedResult;
    }else{
      practiceResult = new PracticeResult(this.currentPractice);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(practiceResult));
    }

    this.fbService.processSavePerformanceToServer(this.currentPractice.practiceName, practiceResult.lastSavedTime, practiceResult.questions);
  }

  loadSavedData(){
    let savedResult: PracticeResult;
    if(localStorage.getItem(this.currentPractice.practiceName)){
      console.log("Load Saved Data");
      savedResult = JSON.parse(localStorage.getItem(this.currentPractice.practiceName)) as PracticeResult;

      if(savedResult.numberOfQuestions <= this.currentPractice.numberOfQuestions){
        PracticeResult.mergeArrayResultToPractice(this.currentPractice, savedResult.questions);
      }
    }

    // Will override local result if the server version is newer
    this.fbService.processRetrievePerformanceFromServer(this.currentPractice.practiceName, savedResult ? savedResult.lastSavedTime : 0, (questionResults) => {
      console.log("Newer version from Server detected. Getting data from server and saving to local");
      PracticeResult.mergeArrayResultToPractice(this.currentPractice, questionResults);
      localStorage.setItem(this.currentPractice.practiceName, JSON.stringify(new PracticeResult(this.currentPractice)));
    });
  }

  // ============================End Save Data =========================================

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
