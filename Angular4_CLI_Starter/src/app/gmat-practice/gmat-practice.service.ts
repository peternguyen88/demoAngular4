import {Injectable, OnInit} from "@angular/core";
import {Stage} from "./Model";
import {GMATPractice} from "../models/gmat-practice";

@Injectable()
export class PracticeService implements OnInit{
  stage: Stage;
  currentPractice: GMATPractice;

  ngOnInit(): void {
    this.stage = Stage.SELECT;
  }

  public choosePracticeSet(practiceSet: GMATPractice){
    this.currentPractice = practiceSet;
    //===========================
    this.stage = Stage.SUMMARY;
  }

  public startPractice(){
    this.stage = Stage.PRACTICE;
  }

  public backToSelection(){
    this.stage = Stage.SELECT;
  }
}
