import {Injectable, OnInit} from "@angular/core";
import {Stage} from "./data/Model";
import {GMATPractice} from "../models/gmat-practice";
import {Http} from "@angular/http";
import {PracticeData} from "./data/practice-sets";

@Injectable()
export class PracticeService{
  stage: Stage = Stage.SELECT;
  currentPractice: GMATPractice;

  constructor(private http:Http){}

  public selectPracticeSet(practiceSet: GMATPractice){
    this.currentPractice = practiceSet;
    // Load Questions from Server
    this.http.get(this.currentPractice.fileLocation).subscribe(response =>{
      if(response.ok) {
        PracticeData.processQuestionFile(this.currentPractice, response.text());
      }
    });
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
