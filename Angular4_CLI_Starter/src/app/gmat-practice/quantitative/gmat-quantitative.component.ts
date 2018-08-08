import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {Stage} from "../data/Model";
import {WebService} from "../../services/web-service";
import {ConfirmMessage, ConfirmMessageConstant} from "../../models/confirm-message";
import {GMATPractice} from "../../models/gmat-practice";
import {PracticeData} from "../data/practice-sets";

/**
 * Main Component for taking GMAT CAT - Premium Mode
 */
@Component({
  templateUrl: 'gmat-quantitative.component.html'
})
export class GmatQuantitativeComponent{
  quantPracticeSets: GMATPractice[];
  popupMessage: ConfirmMessage;

  constructor(private practiceService: PracticeService, private webService: WebService) {
    this.practiceService.stage = Stage.SELECT;
    this.quantPracticeSets = PracticeData.getQuantitativeSets();
  }

  selectPracticeSet(practice: GMATPractice){
    // Have to login to use practice set
    if(practice.practiceName.startsWith('IS') && !this.webService.isLogin()){
      this.popupMessage = ConfirmMessageConstant.PLEASE_LOGIN_TO_CONTINUE;
      this.popupMessage.accept = () => {
        this.webService.login();
      };
      return;
    }

    // if(!this.webService.isStudent()){
    //   this.popupMessage = ConfirmMessageConstant.STUDENT_ACCESS_ONLY;
    //   return;
    // }

    // Continue selecting practice
    this.practiceService.selectPracticeSet(practice);
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
