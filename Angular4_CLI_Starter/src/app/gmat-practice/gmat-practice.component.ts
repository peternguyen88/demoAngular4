import {Component} from "@angular/core";
import {PracticeService} from "./services/gmat-practice.service";
import {Stage} from "./data/Model";
/**
 * Main Component for taking GMAT CAT
 */
@Component({
  templateUrl: 'gmat-practice.component.html'
})
export class GMATPracticeComponent{
  constructor(private practiceService : PracticeService){
    this.practiceService.stage = Stage.SELECT;
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
}
