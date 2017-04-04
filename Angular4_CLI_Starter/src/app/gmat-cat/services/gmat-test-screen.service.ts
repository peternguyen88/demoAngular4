/**
 * All Data used by Test Screen or Summary Screen will be shared using TestScreenService
 */
import { Injectable } from '@angular/core';
import {GMATTest} from "../../models/gmat-test";
import {AbstractQuestion} from "../../models/abstract-question";

@Injectable()
export class TestScreenService {
    isStarted : boolean;
    isPaused : boolean;
    currentTest : GMATTest;
    remainingTime : number;

    currentQuestion : AbstractQuestion;
    currentQuestionTime : number;

    constructor() { }

    public start(){
      this.isStarted = true;
      this.isPaused = false;
      this.currentQuestionTime = 0;
    }

    public pauseOrResume() {
      this.isPaused = !this.isPaused;
    }

    public stop(){
      this.isStarted = false;
      this.isPaused = true;
    }

    public nextQuestion(){

    }
}
