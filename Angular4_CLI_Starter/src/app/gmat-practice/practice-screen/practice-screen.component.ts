/**
 * Display Test To User
 */
import {AfterViewChecked, Component, HostListener, Pipe, PipeTransform} from "@angular/core";
import {Question} from "../../models/question";
import {ConfirmMessage, ConfirmMessageConstant} from "../../models/confirm-message";
import {PracticeMode, QuestionType} from "../../models/constants.enum";
import {DomSanitizer} from "@angular/platform-browser";
import {GMATPractice} from "../../models/gmat-practice";
import {PracticeService} from "../services/gmat-practice.service";
import {Stage} from "../data/Model";
import {UserQuestionReport} from "../../models/firebase.model";
import {WebService} from "../../services/web-service";
import * as $ from 'jquery';

declare var renderMathInElement: any;

@Component({
  moduleId: module.id,
  selector: 'gmat-practice-screen',
  templateUrl: 'practice-screen.component.html',
  styleUrls: ['practice-screen.component.css']
})

export class PracticeScreenComponent implements AfterViewChecked{
  currentQuestion: Question;
  currentPractice: GMATPractice;
  popupMessage: ConfirmMessage;
  practiceMode: PracticeMode = PracticeMode.PRACTICE;
  showCorrectAnswer: boolean = false;
  isHotKeyDisabled: boolean = false;
  isShowingNote = false;
  isShowingExplanation = false;

  updateMathContent: boolean = false;
  questionChangeDetected = false;

  constructor(public practiceService: PracticeService, private webService: WebService) {
    this.updateCurrentQuestion(this.practiceService.getCurrentQuestion());
    this.currentPractice = this.practiceService.currentPractice;
    this.practiceMode = this.practiceService.practiceMode;
  }

  private updateCurrentQuestion(question : Question) {
    this.currentQuestion = question;
    if(this.currentQuestion.question_type == QuestionType.DATA_SUFFICIENCY || this.currentQuestion.question_type == QuestionType.PROBLEM_SOLVING){
      this.updateMathContent = true;
    }
    this.questionChangeDetected = true;
  }

  @HostListener('window:keydown', ['$event'])
  public registerHostkey(event: KeyboardEvent){
    if(this.isReview() && !this.isHotKeyDisabled){
      switch (event.keyCode){
        case 39: // Key Arrow Right
              this.next();
              break;
        case 37: // Key Arrow Left
              this.prev();
              break;
        case 17: // Ctrl
              this.showAnswer();
              break;
      }
    }
  }

  public end() {
    this.practiceService.end();
  }

  public prev() {
    this.practiceService.prev();
    this.updateCurrentQuestion(this.practiceService.getCurrentQuestion());
    this.showCorrectAnswer = false;
    if(!this.currentQuestion.selected_answer){
      this.isShowingNote = false;
    }
  }

  public next() {
    if(this.isInTestMode()){
      if(!this.currentQuestion.selected_answer) {
        this.popupMessage = ConfirmMessageConstant.ANSWER_REQUIRED;
      }
      else if(this.practiceService.isLastQuestion()){
        this.popupMessage = ConfirmMessageConstant.FINAL_QUESTION_REACHED;
        this.popupMessage.accept = () => {
          this.practiceService.end();
          this.closePopup();
        }
      }
      else{
        this.popupMessage = ConfirmMessageConstant.CONFIRM_NEXT_QUESTION;
        this.popupMessage.accept = () => {
          this.practiceService.next();
          this.updateCurrentQuestion(this.practiceService.getCurrentQuestion());
          this.closePopup();
        }
      }
      return;
    }

    if(!this.practiceService.isLastQuestion()) {
      this.practiceService.next();
      this.updateCurrentQuestion(this.practiceService.getCurrentQuestion());
      this.showCorrectAnswer = false;
      if(!this.currentQuestion.selected_answer){
        this.isShowingNote = false;
      }
    }else{
      this.practiceService.end();
    }
  }

  public pauseOrResume() {
    this.practiceService.pauseOrResume();
    if (this.practiceService.isPaused) {
      this.popupMessage = ConfirmMessageConstant.PRACTICE_PAUSED;
      this.popupMessage.accept = () => {
        this.practiceService.pauseOrResume();
      }
    }
    else {
      this.popupMessage = null;
    }
  }

  public closePopup() {
    this.popupMessage = null;
  }

  public isPractice(): boolean {
    return this.practiceService.practiceMode == PracticeMode.PRACTICE;
  }

  public isReview(): boolean{
    return this.practiceService.practiceMode == PracticeMode.REVIEW;
  }

  public showAnswer(){
    this.showCorrectAnswer = !this.showCorrectAnswer;
  }

  public  reportQuestion(){
    if(!this.webService.isLogin()){
      this.popupMessage = ConfirmMessageConstant.PLEASE_LOGIN_TO_CONTINUE;
      this.popupMessage.accept = () => {
        this.webService.login();
      }
    }else {
      this.popupMessage = ConfirmMessageConstant.REPORT_REASON;
      this.popupMessage.accept = () => {
        let report = new UserQuestionReport();
        report.question_set = this.currentPractice.practiceName;
        report.question_number = this.currentQuestion.question_number;
        report.report_content = this.popupMessage.textContent;
        report.report_time = new Date().toDateString();
        this.practiceService.reportQuestion(report);

        delete this.popupMessage.textContent;
      }
    }
  }

  enableHotKey(){
    this.isHotKeyDisabled = false;
  }

  disableHotKey(){
    this.isHotKeyDisabled = true;
  }

  toggleNote(){
    this.isShowingNote = !this.isShowingNote;
    this.isShowingExplanation = false;
  }

  toggleExplanation(){
    this.isShowingExplanation = !this.isShowingExplanation;
    this.isShowingNote = false;
    if(this.isShowingExplanation) this.questionChangeDetected = true;
  }

  ngOnDestroy() {
    if(this.practiceService.stage == Stage.PRACTICE) {
      this.practiceService.endPractice();
    }
  }

  isInTestMode() : boolean{
    return this.practiceMode == PracticeMode.TEST;
  }

  ngAfterViewChecked (): void {
    if(this.updateMathContent && this.questionChangeDetected) {
      renderMathInElement(document.getElementById('section'));
      if (document.getElementById('questionExplanation')) {
        renderMathInElement(document.getElementById('questionExplanation'));
        $('#questionExplanation').scrollTop(0);
      }
      this.questionChangeDetected = false;
    }
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

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  transform(value: string): string {
    if(value) {
      const limit = 100;
      const trail = '...';
      return value.length > limit ? value.substring(0, limit) + trail : value;
    }
    else{
      return null;
    }
  }
}
