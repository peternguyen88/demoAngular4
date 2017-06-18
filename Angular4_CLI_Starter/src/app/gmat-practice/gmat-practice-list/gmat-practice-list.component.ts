/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";
import {PracticeData} from "../data/practice-sets";
import {ConfirmMessage, ConfirmMessageConstant} from "../../models/confirm-message";
import {WebService} from "../../services/web-service";

@Component({
  moduleId: module.id,
  selector: 'gmat-practice-list',
  templateUrl: 'gmat-practice-list.component.html'
})
export class GMATPracticeListComponent {
  practiceSets: GMATPractice[];
  popupMessage: ConfirmMessage;

  constructor(private practiceService: PracticeService, private webService: WebService) {
    this.practiceSets = PracticeData.getAllPracticeSets();
  }

  selectPracticeSet(practice: GMATPractice){
    // Have to login to use practice set
    if(practice.practiceName.indexOf("QP") != -1 && !this.webService.isLogin()){
      this.popupMessage = ConfirmMessageConstant.PLEASE_LOGIN_TO_CONTINUE;
      this.popupMessage.accept = () => {
        this.webService.login();
      };
      return;
    }
    // Continue selecting practice
    this.practiceService.selectPracticeSet(practice);
  }
}
