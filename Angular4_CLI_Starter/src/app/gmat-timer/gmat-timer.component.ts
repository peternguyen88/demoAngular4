/**
 * GMAT Timer to keep track when practice.
 */
import { Component, OnInit } from '@angular/core';
import {TimerStage, TimerType} from "../models/constants.enum";
import {TimerService} from "../services/gmat-timer.service";

@Component({
    moduleId: module.id,
    selector: 'gmat-timer',
    templateUrl: 'gmat-timer.component.html'
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
      this.timerService.timerStage = TimerStage.WELCOME;
    }
}
