import {Injectable} from "@angular/core";
import {TimerStage, TimerType} from "../models/constants.enum";
import {TimerQuestion} from "../models/timer-question";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Rx";

@Injectable()
export class TimerService {
  session: TimerType;
  timerStage: TimerStage = TimerStage.WELCOME;
  questions: TimerQuestion[];
  numberOfCorrectAnswer: number;

  remainingTime: number = 0;
  allowedTime: number = 0;
  elapsedTime: number = 0;
  averageQuestionTime: number = 0;
  expectedQuestionTime: number = 0;

  currentQuestion: TimerQuestion = new TimerQuestion(0);
  currentQuestionIndex: number = 0;
  expectedQuestion: number = 0;
  numberOfQuestion: number = 0;

  isPaused: boolean;
  isStarted: boolean;

  subscription: Subscription;

  public start(){
    this.isStarted = true;
    this.isPaused = false;
    this.averageQuestionTime = 0;
    this.remainingTime = this.allowedTime;
    this.elapsedTime = 0;
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.currentQuestion = new TimerQuestion(0);
    this.addQuestion();

    this.subscribe();
  }

  private subscribe(){
    this.subscription = Observable.interval(1000).subscribe(r => {
      this.updateEachSecond();
    });
  }

  private unSubscribe(){
    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  public stop(){
    this.isStarted = false;
    this.isPaused = true;
    this.unSubscribe();
  }

  public pauseOrResume(){
    this.isPaused = !this.isPaused;
    if(this.isPaused){
      this.unSubscribe();
    }
    else{
      this.subscribe();
    }
  }

  private updateEachSecond(){
    this.elapsedTime++;
    this.currentQuestion.question_time++;
    this.remainingTime--;
    this.averageQuestionTime = this.elapsedTime/this.questions.length;
  }

  public nextQuestion(){
    this.currentQuestionIndex++;
    this.currentQuestion = new TimerQuestion(this.currentQuestionIndex);
    this.addQuestion();
  }

  public setSession(timerType: TimerType) {
    this.session = timerType;
    if(timerType == TimerType.QUANTITATIVE){
      this.allowedTime = 75*60;
      this.remainingTime = 75*60;
      this.numberOfQuestion = 37;
    }
    if(timerType == TimerType.VERBAL){
      this.allowedTime = 75*60;
      this.remainingTime = 75*60;
      this.numberOfQuestion = 41;
    }
  }

  public addQuestion() {
    this.questions = [...this.questions, this.currentQuestion];
  }
}
