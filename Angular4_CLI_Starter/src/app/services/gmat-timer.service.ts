import {Injectable} from "@angular/core";
import {TimerStage, TimerType} from "../models/constants.enum";
import {TimerQuestion} from "../models/timer-question";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TimerService {
  session: TimerType;
  timerStage: TimerStage = TimerStage.WELCOME;
  questions: TimerQuestion[];
  numberOfCorrectAnswer: number;

  remainingTime: number;
  allowedTime: number;
  elapsedTime: number;
  averageQuestionTime: number;
  expectedQuestionTime: number;

  currentQuestion: TimerQuestion = new TimerQuestion(0);
  currentQuestionIndex: number;
  expectedQuestion: number;
  numberOfQuestion: number;

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

    this.subscribe();
  }

  private subscribe(){
    this.subscription = Observable.interval(1000).subscribe(response => {
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

  }

  private updateEachSecond(){

  }

  public nextQuestion(){
    this.addQuestion(this.currentQuestion);
    this.currentQuestionIndex++;
    this.currentQuestion = new TimerQuestion(this.currentQuestionIndex);
  }

  public resetQuestionList() {
    this.numberOfCorrectAnswer = 0;
    this.questions = [];
  }

  public setSession(timerType: TimerType) {
    this.session = timerType;
    if(timerType == TimerType.QUANTITATIVE){
      this.remainingTime = 75*60;
      this.numberOfQuestion = 37;
    }
    if(timerType == TimerType.VERBAL){
      this.remainingTime = 75*60;
      this.numberOfQuestion = 41;
    }
  }

  public addQuestion(question: TimerQuestion) {
    this.questions = [...this.questions, question];
  }
}
