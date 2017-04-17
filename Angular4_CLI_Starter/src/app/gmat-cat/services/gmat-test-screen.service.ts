/**
 * All Data used by Test Screen or Summary Screen will be shared using TestScreenService
 */
import {Injectable} from "@angular/core";
import {GMATTest} from "../../models/gmat-test";
import {Question} from "../../models/question";
import {Http} from "@angular/http";
import {EnumTestStage, QuestionType, TestMode} from "../../models/constants.enum";
import {Observable, Subscription} from "rxjs";

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

    constructor(private http: Http) { }

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

      this.subscribe();
    }

    public endTestAndStartReview(){
      this.testStage = EnumTestStage.FINISHED;
      this.numberOfCorrectQuestions = 0;
      this.currentTest.questions.forEach(e => {if (e.isCorrect()) this.numberOfCorrectQuestions++});
    }

    public endReview(){
      this.testStage = EnumTestStage.FINISHED;
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
      if(this.currentQuestionIndex < this.currentTest.numberOfQuestions - 1){
        this.currentQuestionIndex++;
        this.currentQuestionTime = this.currentTest.questions[this.currentQuestionIndex].question_time;
      }
    }

    public isLastQuestionReached(): boolean{
      return this.currentQuestionIndex == this.currentTest.numberOfQuestions - 1;
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
      return this.currentTest.questions[this.currentQuestionIndex];
    }

    public setCurrentTest(test : GMATTest){
      this.currentTest = test;
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
      this.expectedQuestion = Math.floor(this.currentTest.numberOfQuestions * this.elapsedTime/this.allowedTime) + 1;
      this.elapsedTime++;
      this.remainingTime--;
      if(this.remainingTime <= 0 && this.testMode == TestMode.TEST){
        this.subscription.unsubscribe();
        if(this.timeout){
          this.timeout();
        }
      }
    }

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

        question.question_number = currentQuestionIndex++;
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
}
