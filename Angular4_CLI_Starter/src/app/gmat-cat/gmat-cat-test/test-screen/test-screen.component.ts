/**
 * Display Test To User
 */
import {Component, EventEmitter, Output, Pipe, PipeTransform} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {Question} from "../../../models/question";
import {DomSanitizer} from "@angular/platform-browser";
import {GMATTest} from "../../../models/gmat-test";
import {TestMode} from "../../../models/constants.enum";
import {ConfirmMessage, ConfirmMessageConstant} from "../../../models/confirm-message";

@Component({
  moduleId: module.id,
  selector: 'test-screen',
  templateUrl: 'test-screen.component.html',
  styleUrls: ['test-screen.component.css']
})
export class TestScreenComponent {
  currentQuestion: Question;
  currentTest: GMATTest;
  popupMessage: ConfirmMessage;
  testMode: TestMode = TestMode.TEST;

  @Output() endTestEvent = new EventEmitter();

  constructor(public testScreenService: TestScreenService) {
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
    this.currentTest = this.testScreenService.currentTest;
    this.testScreenService.timeout = () => {
      this.popupMessage = ConfirmMessageConstant.TIMEOUT;
      this.popupMessage.accept = () => {
        this.switchTestMode();
        this.testScreenService.continueInPracticeMode();
      };
      this.popupMessage.reject = () => {
        this.backToSummary();
      };
    }
  };

  private endTestAndStartReview(){
    this.endTestEvent.emit();
  }

  public nextQuestion() {
    // if (!this.currentQuestion.selected_answer) {
    //   this.popupMessage = ConfirmMessageConstant.ANSWER_REQUIRED;
    // } else
      {
      if(this.testScreenService.isLastQuestionReached()){
        this.popupMessage = ConfirmMessageConstant.FINAL_QUESTION_REACHED;
        this.popupMessage.accept = ()=>{
          this.confirmNextQuestion();
          this.endTestAndStartReview();
        }
      }
      else {
        // this.popupMessage = ConfirmMessageConstant.CONFIRM_NEXT_QUESTION;
        // this.popupMessage.accept = () => {
          this.confirmNextQuestion();
        // }
      }
    }
  }

  public confirmNextQuestion() {
    this.testScreenService.nextQuestion();
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
    this.closePopup();
  }

  public backToSummary(): void {
    this.testScreenService.backToSummary();
  }

  public pauseOrResume() {
    this.testScreenService.pauseOrResume();
    if (this.testScreenService.isPaused) {
      this.popupMessage = ConfirmMessageConstant.TEST_PAUSED;
      this.popupMessage.accept = () => {
        this.testScreenService.pauseOrResume();
      }
    }
    else {
      this.popupMessage = null;
    }
  }

  public closePopup() {
    this.popupMessage = null;
  }

  public switchTestMode() {
    if (this.testMode == TestMode.TEST) {
      this.testMode = TestMode.PRACTICE;
      this.testScreenService.testMode = TestMode.PRACTICE;
    }
    else {
      if(this.testScreenService.remainingTime >0) {
        this.testMode = TestMode.TEST;
        this.testScreenService.testMode = TestMode.TEST;
      }
      else{
        this.popupMessage = ConfirmMessageConstant.CANNOT_SWITCH_TO_TEST_MODE;
      }
    }
  }

  public isTestMode(): boolean {
    return this.testMode == TestMode.TEST;
  }

  public isPracticeMode(): boolean {
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
