import {Component} from "@angular/core";
import {PracticeService} from "../services/gmat-practice.service";
import {Stage} from "../data/Model";
import {WebService} from "../../services/web-service";
import {ConfirmMessage, ConfirmMessageConstant} from "../../models/confirm-message";
import {GMATPractice} from "../../models/gmat-practice";
import {PracticeData} from "../data/practice-sets";
import {ActivatedRoute} from "@angular/router";

/**
 * Main Component for taking GMAT CAT - Premium Mode
 */
@Component({
  templateUrl: 'gmat-club-test.component.html'
})
export class GmatClubTestComponent{
  gmatClubTest: GMATPractice[];
  popupMessage: ConfirmMessage;

  constructor(private route: ActivatedRoute, private practiceService: PracticeService, private webService: WebService) {
    this.practiceService.stage = Stage.SELECT;
    this.gmatClubTest = PracticeData.getGMATClubTests();
  }

  selectPracticeSet(practice: GMATPractice){
    // Have to login to use practice set
    // if(practice.practiceName.startsWith('IS') && !this.webService.isLogin()){
    //   this.popupMessage = ConfirmMessageConstant.PLEASE_LOGIN_TO_CONTINUE;
    //   this.popupMessage.accept = () => {
    //     this.webService.login();
    //   };
    //   return;
    // }

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

  ngOnInit() {
    let setID = this.route.snapshot.paramMap.get('setID');
    if(setID){
      let practiceSets :GMATPractice[] = PracticeData.getGMATClubTests().filter(p => p.practiceName === setID);
      if(practiceSets.length){
        this.practiceService.selectPracticeSet(practiceSets[0]);
        this.practiceService.stage = Stage.SUMMARY;
      }
    }else{
      this.practiceService.stage = Stage.SELECT;
    }
  }
}
