/**
 * All Data used by Test Screen or Summary Screen will be shared using TestScreenService
 */
import {Injectable} from "@angular/core";
import {GMATTest} from "../../models/gmat-test";
import {Question} from "../../models/question";
import {Http} from "@angular/http";
import {EnumTestStage, QuestionType, TestMode} from "../../models/constants.enum";
import {Observable, Subscription} from "rxjs";
import {QuestionResult, TestResult} from "../../models/test-result";
import {FirebaseService} from "../../services/firebase.service";

@Injectable()
export class TestScreenService {
    isStarted : boolean;
    isPaused : boolean;
    currentTest : GMATTest;
    remainingTime : number;
    allowedTime: number;
    elapsedTime: number;
    testMode: TestMode = TestMode.TEST;
    testStage : EnumTestStage = EnumTestStage.WELCOME;

    expectedQuestion: number;
    currentQuestionIndex : number;
    currentQuestionTime : number = 0;
    numberOfCorrectQuestions: number = 0;

    subscription : Subscription;
    timeout: Function;

    questions: Question[];

    constructor(private http: Http, private fbService: FirebaseService) { }

    public start(){
      this.isStarted = true;
      this.isPaused = false;
      this.currentQuestionTime = 0;
      this.currentQuestionIndex = 0;
      this.remainingTime = this.allowedTime;
      this.elapsedTime = 0;
      this.expectedQuestion = 1;
      this.testMode = TestMode.TEST;
      this.testStage = EnumTestStage.STARTED;
      this.questions = this.currentTest.questions;
      this.clearSelectedAnswer();
      this.subscribe();
    }

    public endTestAndOpenTestSummaryScreen(){
      this.testStage = EnumTestStage.FINISHED;
      this.numberOfCorrectQuestions = 0;
      this.currentTest.questions.forEach(e => {if (e.isCorrect()) this.numberOfCorrectQuestions++});
    }

    public reviewQuestion(question: Question){
      this.testMode = TestMode.REVIEW;
      this.currentQuestionIndex = this.questions.indexOf(question);
      this.currentQuestionTime = question.question_time;
      this.startReviewMode();
    }

    public endReview(){
      this.testStage = EnumTestStage.FINISHED;
      this.questions = this.currentTest.questions;
    }

    public startReviewMode(){
      this.testStage = EnumTestStage.REVIEW;
    }

    public continueInPracticeMode(){
      this.isStarted = true;
      this.isPaused = false;
      this.testMode = TestMode.PRACTICE;
      this.subscribe();
    }

    public pauseOrResume() {
      this.isPaused = !this.isPaused;
      if(this.isPaused){
        this.unSubscribe();
      }
      else{
        this.subscribe();
      }
    }

    public stop(){
      this.isStarted = false;
      this.isPaused = true;
      this.unSubscribe();
    }

    public review(testResult: TestResult){
      this.questions = this.currentTest.questions;
      let currentQuestion = 0;
      while(currentQuestion < testResult.numberOfAnsweredQuestions){
        this.questions[currentQuestion].selected_answer = testResult.questions[currentQuestion].selected_answer;
        this.questions[currentQuestion].question_time = testResult.questions[currentQuestion].question_time;
        currentQuestion++;
      }
      this.currentQuestionIndex = 0;
      this.testMode = TestMode.REVIEW;
      this.testStage = EnumTestStage.FINISHED;
    }

    public resume(testResult: TestResult){
      this.questions = this.currentTest.questions;
      let currentQuestion = 0;
      let totalTimeSpent = 0;
      while(currentQuestion < testResult.numberOfAnsweredQuestions){
        this.questions[currentQuestion].selected_answer = testResult.questions[currentQuestion].selected_answer;
        this.questions[currentQuestion].question_time = testResult.questions[currentQuestion].question_time;
        totalTimeSpent+= testResult.questions[currentQuestion].question_time;
        currentQuestion++;
      }
      this.currentQuestionIndex = currentQuestion;

      this.isStarted = true;
      this.isPaused = false;
      this.currentQuestionTime = 0;
      this.remainingTime = this.allowedTime - totalTimeSpent;
      this.elapsedTime = totalTimeSpent;
      this.expectedQuestion = Math.floor(this.questions.length * this.elapsedTime/this.allowedTime) + 1;
      this.testMode = TestMode.TEST;
      this.testStage = EnumTestStage.STARTED;

      this.subscribe();
    }

    public nextQuestion(){
      if(this.currentQuestionIndex < this.currentTest.numberOfQuestions - 1){
        this.getCurrentQuestion().question_time = this.currentQuestionTime;
        this.currentQuestionTime = 0;
        this.currentQuestionIndex++;
      }
      else{
        // Last Question - Only need to keep track time
        this.getCurrentQuestion().question_time = this.currentQuestionTime;
      }
    }

    public reviewNextQuestion(){
      console.log("Review Next Question");
      if(this.currentQuestionIndex < this.questions.length - 1){
        this.currentQuestionIndex++;
        this.currentQuestionTime = this.questions[this.currentQuestionIndex].question_time;
      }
    }

    public isLastQuestionReached(): boolean{
      return this.currentQuestionIndex == this.questions.length - 1;
    }

    public isFirstQuestion(): boolean{
      return this.currentQuestionIndex == 0;
    }

    public previousQuestion(){
      if(this.currentQuestionIndex > 0){
        console.log("Go to Previous Question");
        this.currentQuestionIndex--;
        this.currentQuestionTime = this.getCurrentQuestion().question_time;
      }
    }

    public getCurrentQuestion():Question{
      return this.questions[this.currentQuestionIndex];
    }

    public setCurrentTest(test : GMATTest){
      this.currentTest = test;
      this.questions = test.questions;
      if(this.currentTest!=null) {
        this.loadQuestionsFromServer();
        this.allowedTime = this.currentTest.allowedTime;
      }
    }

    private loadQuestionsFromServer(){
      this.http.get(this.currentTest.fileLocation).subscribe(response =>{
        if(response.ok) {
          this.processTestFile(response.text());
        }
      });
    }

    private subscribe(){
      console.log("Subscribe");
      this.subscription = Observable.interval(1000).subscribe(res => {
        this.updateEachSecond();
      });
    }

    private unSubscribe(){
      if(this.subscription){
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    }

    private updateEachSecond(){
      console.log("Tick");
      this.currentQuestionTime++;
      this.expectedQuestion = Math.floor(this.questions.length * this.elapsedTime/this.allowedTime) + 1;
      this.elapsedTime++;
      this.remainingTime--;
      if(this.remainingTime <= 0 && this.testMode == TestMode.TEST){
        this.subscription.unsubscribe();
        if(this.timeout){
          this.timeout();
        }
      }
    }

  // =============================Save data to Local Storage & Server==========================
    public autoSaveTest(){
      let testResult = new TestResult(this.currentTest);
      localStorage.setItem(this.currentTest.testName, JSON.stringify(testResult));
      this.fbService.processSavePerformanceToServer(this.currentTest.testName, testResult.lastSavedTime, testResult.questions);
    }

    public loadSavedData(callback: (t: TestResult) => any){
      let savedTest = localStorage.getItem(this.currentTest.testName);
      let testResult: TestResult;
      if(savedTest){
        testResult = JSON.parse(savedTest) as TestResult;
        callback(testResult);
      }
      this.fbService.processRetrievePerformanceFromServer(this.currentTest.testName, testResult ? testResult.lastSavedTime : 0, (questionResults) => {
        if(!testResult){
          testResult = new TestResult(this.currentTest);
        }
        testResult.questions = [];
        questionResults.forEach(e => {
          if(e.selected_answer) testResult.questions.push(e);
        });
        testResult.numberOfAnsweredQuestions = testResult.questions.length;

        callback(testResult);
      });
    }

    public deleteSavedData(){
      localStorage.setItem(this.currentTest.testName, null);
      this.fbService.deleteSavedPerformanceFromServer(this.currentTest.testName);
    }
    // ===========================End Saving & Loading Data====================================

    private processTestFile(testContent : string){
      this.currentTest.questions = [];
      let lines : string[] = testContent.split("\n");
      lines.pop(); // Remove Last Line
      // Line 1 - Number of Questions
      this.currentTest.numberOfQuestions = Number(lines[0].replace("####",""));
      console.log(this.currentTest.numberOfQuestions);
      let numberOfLines = lines.length;
      let currentLineIndex = 1;
      let currentQuestionIndex = 1;
      let lastQuestionType = null;
      while(currentLineIndex < numberOfLines){
        // First Line is Question Type
        let question = new Question();
        if(lines[currentLineIndex] == "#SC#"){
          console.log("SC");
          question.question_type = QuestionType.SENTENCE_CORRECTION;
        }
        if(lines[currentLineIndex] == "#CR#"){
          console.log("CR");
          question.question_type = QuestionType.CRITICAL_REASONING;
        }
        if(lines[currentLineIndex] == "#RC#"){
          console.log("RC");
          question.question_type = QuestionType.READING_COMPREHENSION;
          question.reading_passage = lines[++currentLineIndex].replace("#R#","");
          if(lastQuestionType!=QuestionType.READING_COMPREHENSION){
            question.isFirstRC = true;
          }
        }

        lastQuestionType = question.question_type;
        currentLineIndex++;

        question.question_number = (currentQuestionIndex++)+"";
        question.question_stem = lines[currentLineIndex++].replace("#Q#","");
        question.option_A = lines[currentLineIndex++].replace("#O#(A) ","").replace("#O#A. ","");
        question.option_B = lines[currentLineIndex++].replace("#O#(B) ","").replace("#O#B. ","");
        question.option_C = lines[currentLineIndex++].replace("#O#(C) ","").replace("#O#C. ","");
        question.option_D = lines[currentLineIndex++].replace("#O#(D) ","").replace("#O#D. ","");
        question.option_E = lines[currentLineIndex++].replace("#O#(E) ","").replace("#O#E. ","");
        question.correct_answer = lines[currentLineIndex++].replace("#A#","");

        console.log(question);
        this.currentTest.questions.push(question);
      }
    }

    public backToSummary(){
      this.currentTest = null;
    }

    public backToWelcome(){
      this.testStage = EnumTestStage.WELCOME;
    }

    private clearSelectedAnswer(){
      this.questions.forEach(e => {
        e.selected_answer = null;
        e.question_time = 0;
      });
    }
}
