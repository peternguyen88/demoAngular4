/**
 * Static Welcome Screen Before User Takes Test
 */
import {Component, OnInit} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {TestResult} from "../../../models/test-result";
import {ConfirmMessage, ConfirmMessageConstant} from "../../../models/confirm-message";

@Component({
    moduleId: module.id,
    selector: 'test-welcome-screen',
    templateUrl: 'test-welcome-screen.component.html'
})
export class TestWelcomeScreenComponent implements OnInit{
    testResult: TestResult;
    popupMessage: ConfirmMessage;
    constructor(private testScreenService: TestScreenService) { }

    ngOnInit(): void {
      this.testScreenService.loadSavedData(testResult => this.testResult = testResult);
    }

    public resumeTest(){
      this.testScreenService.resume(this.testResult);
    }

    deleteSavedData(){
      this.popupMessage = ConfirmMessageConstant.CONFIRM_DELETE_SAVED_DATA;
      this.popupMessage.accept = () => {
        this.testScreenService.deleteSavedData();
        this.testResult = null;
      };
    }

    public reviewTest(){
      this.testScreenService.review(this.testResult);
    }

    public startTest() : void{
      this.testScreenService.start();
    }

    public backToSummary(){
      this.testScreenService.backToSummary();
}
}
