/**
 * GMAT Timer to keep track when practice.
 */
import { Component, OnInit } from '@angular/core';
import {TimerStage, TimerType} from "../models/constants.enum";
import {TimerService} from "../services/gmat-timer.service";
import {TimerQuestion} from "../models/timer-question";

@Component({
    moduleId: module.id,
    selector: 'gmat-timer',
    templateUrl: 'gmat-timer.component.html',
    styleUrls:['gmat-timer.component.css']
})
export class GmatTimerComponent implements OnInit {
    constructor(public timerService: TimerService) {
    }

    ngOnInit() {}

    public startPractice(){
      this.chooseSession(TimerType.PRACTICE);
      this.timerService.timerStage = TimerStage.TIMING;
    }

    public startVerbal(){
      this.chooseSession(TimerType.VERBAL);
      this.timerService.timerStage = TimerStage.TIMING;
    }

    public startQuantitative(){
      this.chooseSession(TimerType.QUANTITATIVE);
      this.timerService.timerStage = TimerStage.TIMING;
    }

    private chooseSession(session: TimerType){
      this.timerService.setSession(session);
    }

    public isWelcome():boolean{
      return this.timerService.timerStage == TimerStage.WELCOME;
    }

    public isTiming():boolean{
      return this.timerService.timerStage == TimerStage.TIMING;
    }

    public isReview():boolean{
      return this.timerService.timerStage == TimerStage.REVIEW;
    }

    public backToWelcome(){
      this.stop();
      this.timerService.clearStats();
      this.timerService.timerStage = TimerStage.WELCOME;
    }

    public backToTimingSession(){
      this.timerService.timerStage = TimerStage.TIMING;
    }

    public review(){
      if(this.timerService.isStarted && !this.timerService.isPaused){
        this.pauseOrResume();
      }
      this.timerService.timerStage = TimerStage.REVIEW;
    }

    public start(){
      this.timerService.start();
    }

    public stop(){
      this.timerService.stop();
    }

    public pauseOrResume(){
      this.timerService.pauseOrResume();
    }

    public isStarted():boolean{
      return this.timerService.isStarted;
    }

    public isPaused():boolean{
      return this.timerService.isPaused;
    }

    public isPracticeSession():boolean{
      return this.timerService.session == TimerType.PRACTICE;
    }

    public next(){
      this.timerService.nextQuestion();
    }

    public getSessionLabel():string{
      if(this.timerService.session == TimerType.QUANTITATIVE){
        return "Quantitative Session (37 Questions)";
      }
      if(this.timerService.session == TimerType.VERBAL){
        return "Verbal Session (41 Questions)";
      }
      return "Practice Session";
    }

    public getCorrectStatsLabel(){
      if(this.timerService.questions){
        return this.timerService.numberOfCorrectAnswer + "/" + this.timerService.questions.length + " Correct"
      }
      else{
        return "0/0 Correct";
      }
    }

    public onCorrectCheckboxChange(question: TimerQuestion){
      if(question.is_correct){
        question.correct_answer = question.selected_answer;
        this.timerService.numberOfCorrectAnswer++;
      }
      else{
        question.correct_answer = null;
        this.timerService.numberOfCorrectAnswer--;
      }
    }

    public onRadioCorrectAnswerChange(question: TimerQuestion){
      question.is_correct = question.selected_answer == question.correct_answer;
    }

    public getQuestionForReview(): TimerQuestion[]{
      return this.timerService.questions.filter(e => e.selected_answer);
    }

  ngOnDestroy() {
    this.stop();
  }
}
