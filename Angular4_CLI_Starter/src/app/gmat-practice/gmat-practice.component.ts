import {Component} from "@angular/core";
import {PracticeService} from "./services/gmat-practice.service";
import {Stage} from "./data/Model";
import {ActivatedRoute} from '@angular/router';
import {PracticeData} from "./data/practice-sets";
import {GMATPractice} from "../models/gmat-practice";

/**
 * Main Component for taking GMAT CAT
 */
@Component({
  templateUrl: 'gmat-practice.component.html'
})
export class GMATPracticeComponent{
  constructor(private route: ActivatedRoute, private practiceService : PracticeService){
  }

  isSelectStage():boolean{
    return this.practiceService.stage == Stage.SELECT;
  }

  isSummaryStage():boolean{
    return this.practiceService.stage == Stage.SUMMARY;
  }

  isPracticeStage():boolean{
    return this.practiceService.stage == Stage.PRACTICE;
  }

  ngOnInit() {
    let setID = this.route.snapshot.paramMap.get('setID');
    let questionNoReview = this.route.snapshot.paramMap.get('questionNoReview');
    let questionNoPractice = this.route.snapshot.paramMap.get('questionNoPractice');
    if(setID){
      let practiceSets :GMATPractice[] = PracticeData.getAllPracticeSets().filter(p => p.practiceName === setID);
      if(practiceSets.length){
        this.practiceService.selectPracticeSet(practiceSets[0]);
        this.practiceService.stage = Stage.SUMMARY;

        if(questionNoReview){
          this.practiceService.reviewAt(parseInt(questionNoReview)-1);
        }
        if(questionNoPractice){
          this.practiceService.startAt(parseInt(questionNoPractice)-1);
        }
      }
    }else{
      this.practiceService.stage = Stage.SELECT;
    }
  }
}
