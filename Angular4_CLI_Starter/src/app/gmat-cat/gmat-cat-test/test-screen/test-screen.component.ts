/**
 * Display Test To User
 */
import {Component, Pipe, PipeTransform} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {Question} from "../../../models/question";
import {DomSanitizer} from "@angular/platform-browser";
import {GMATTest} from "../../../models/gmat-test";
import {PopupMessage} from "../../../models/popup-message";
import {TestMode} from "../../../models/constants.enum";

@Component({
  moduleId: module.id,
  selector: 'test-screen',
  templateUrl: 'test-screen.component.html',
  styleUrls: ['test-screen.component.css']
})
export class TestScreenComponent {
  currentQuestion: Question;
  currentTest: GMATTest;
  popupMessage: PopupMessage;
  testMode: TestMode = TestMode.TEST;

  constructor(public testScreenService: TestScreenService) {
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
    this.currentTest = this.testScreenService.currentTest;
  }

  public nextQuestion() {
    if (!this.currentQuestion.selected_answer) {
      this.popupMessage = PopupMessage.ANSWER_REQUIRED;
    } else {
      this.popupMessage = PopupMessage.CONFIRM_NEXT_QUESTION;
    }
  }

  public confirmNextQuestion(){
    this.testScreenService.nextQuestion();
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
    this.closePopup();
  }

  public backToSummary(): void {
    this.testScreenService.backToSummary();
  }

  public pauseOrResume(){
    this.testScreenService.pauseOrResume();
    if(this.testScreenService.isPaused){
      this.popupMessage = PopupMessage.TEST_PAUSED;
    }
    else{
      this.popupMessage = null;
    }
  }

  public closePopup(){
    this.popupMessage = null;
  }

  public switchTestMode(){
    if(this.testMode == TestMode.TEST){
      this.testMode = TestMode.PRACTICE;
      this.testScreenService.testMode = TestMode.PRACTICE;
    }
    else{
      this.testMode = TestMode.TEST;
      this.testScreenService.testMode = TestMode.TEST;
    }
  }

  public isTestMode(): boolean{
    return this.testMode == TestMode.TEST;
  }

  public isPracticeMode(): boolean{
    return this.testMode == TestMode.PRACTICE;
  }

  ngOnDestroy() {
    this.testScreenService.stop();
  }
}

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
