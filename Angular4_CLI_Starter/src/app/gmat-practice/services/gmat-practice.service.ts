import {Injectable} from "@angular/core";
import {Stage} from "../data/Model";
import {GMATPractice} from "../../models/gmat-practice";
import {Http} from "@angular/http";
import {PracticeData} from "../data/practice-sets";
import {PracticeMode} from "../../models/constants.enum";
import {Subscription} from "rxjs/Subscription";
import {Question} from "../../models/question";
import {Observable} from "rxjs/Observable";
import {PracticeResult} from "../../models/test-result";
import {WebService} from "../../services/web-service";
import {UserQuestionReport} from "../../models/firebase.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Injectable()
export class PracticeService{
  currentPractice: GMATPractice;

  constructor(private location: Location, private router: Router, private route:ActivatedRoute, private http:Http, private webService: WebService){}

  //========================================Render Control ===================================================
  stage: Stage = Stage.SELECT;
  cache : boolean = true;
  isLoading: boolean = false;

  public selectPracticeSet(practiceSet: GMATPractice){
    const url = this.router.url.split('?')[0];
    if(url.indexOf(practiceSet.practiceName) < 0) {
      const newUrl = url + '/' + practiceSet.practiceName;
      console.log(newUrl);
      this.location.go(newUrl);
    }

    this.currentPractice = practiceSet;

    // Try to load from Session Storage
    if(sessionStorage.getItem(this.currentPractice.practiceName) && this.cache){
      PracticeData.processQuestionFile(this.currentPractice, sessionStorage.getItem(this.currentPractice.practiceName));
      this.loadSavedData();
    }
    else {
      this.isLoading = true;
      // Load Questions from Server
      this.http.get(this.currentPractice.fileLocation).subscribe(response => {
        if (response.ok) {
          PracticeData.processQuestionFile(this.currentPractice, response.text());
          this.loadSavedData();
          // Save to Session Storage for next time use
          sessionStorage.setItem(this.currentPractice.practiceName, response.text());
          this.isLoading = false;
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

    const url = this.router.url.split('?')[0];
    this.location.go(url);
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
    this.practiceMode = PracticeMode.TEST;
  }

  startAt(index: number){

    if(this.isLoading) {
      let self = this;
      setTimeout(function () {
        self.startAt(index);
      }, 200);
      return;
    }

    this.startPractice();

    this.isStarted = true;
    this.isPaused = false;
    this.currentQuestionTime = 0;
    this.currentQuestionIndex = index;
    this.elapsedTime = 0;
    this.practiceMode = this.currentPractice.isTest() ? PracticeMode.TEST : PracticeMode.PRACTICE;
    this.questions = this.currentPractice.questions;
    this.clearSelectedAnswer();
    this.subscribe();
  }

  resume(index: number){
    if(this.practiceMode == PracticeMode.TEST){
      let totalTimeOfPreviousQuestions = this.sumTotalTimeOfPreviousQuestions(index);
      this.startAt(index);
      this.elapsedTime = totalTimeOfPreviousQuestions;
    }else{
      this.startAt(index);
    }
  }

  sumTotalTimeOfPreviousQuestions(index: number) : number{
    let count = 0;
    let sum = 0;
    for(let question of this.currentPractice.questions){
      if(count++ < index){
        sum += question.question_time;
      }else{
        break;
      }
    }
    return sum;
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
    if(this.practiceMode == PracticeMode.PRACTICE || this.practiceMode == PracticeMode.TEST){
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

    if(this.isLoading) {
      let self = this;
      setTimeout(function () {
        self.reviewAt(index);
      }, 200);
      return;
    }

    this.practiceMode = PracticeMode.REVIEW;
    this.currentQuestionIndex = index;
    this.questions = this.currentPractice.questions;
    this.currentQuestionTime = this.getCurrentQuestion().question_time;

    if(this.currentPractice.hasExplanation){
      if(sessionStorage.getItem(this.currentPractice.getExplanationName()) && this.cache){
        PracticeData.processExplanationFile(this.currentPractice, sessionStorage.getItem(this.currentPractice.getExplanationName()));
        PracticeData.safeGuardExplanationForPremiumUser(this.currentPractice, this.webService);
        console.log('Cache');
        this.startPractice();
      }
      else {
        // Load Questions from Server
        this.http.get(this.currentPractice.getExplanationLocation()).subscribe(response => {
          if (response.ok) {
            PracticeData.processExplanationFile(this.currentPractice, response.text());
            PracticeData.safeGuardExplanationForPremiumUser(this.currentPractice, this.webService);
            sessionStorage.setItem(this.currentPractice.getExplanationName(), response.text());
          }
          this.startPractice();
        });
      }
    }
    else{
      this.startPractice();
    }
  }

  endReview(){
    this.savePracticeData();
    this.backToSummary();
  }

  updateEachSecond(){
    if(this.practiceMode != PracticeMode.REVIEW) {
      this.currentQuestionTime++;
      this.elapsedTime++;
    }
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

  // ------------- Report ----------------

  public reportQuestion(report: UserQuestionReport){
    this.webService.reportQuestion(report);
  }

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

    this.webService.processSavePerformanceToServer(this.currentPractice.practiceName, practiceResult.lastSavedTime, practiceResult.questions);
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
    this.webService.processRetrievePerformanceFromServer(this.currentPractice.practiceName, savedResult ? savedResult.lastSavedTime : 0, (questionResults) => {
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
