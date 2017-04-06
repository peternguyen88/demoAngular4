/**
 * Display Test To User
 */
import {Component, EventEmitter, Output, Pipe, PipeTransform} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {Question} from "../../../models/question";
import {DomSanitizer} from "@angular/platform-browser";
import {GMATTest} from "../../../models/gmat-test";

@Component({
  moduleId: module.id,
  selector: 'test-screen',
  templateUrl: 'test-screen.component.html',
  styleUrls: ['test-screen.component.css']
})
export class TestScreenComponent {
  currentQuestion: Question;
  currentTest: GMATTest;

  constructor(private testScreenService: TestScreenService) {
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
    this.currentTest = this.testScreenService.currentTest;
  }

  public nextQuestion() {
    this.testScreenService.nextQuestion();
    this.currentQuestion = this.testScreenService.getCurrentQuestion();
  }

  public backToSummary(): void {
    this.testScreenService.backToSummary();
  }

  public selectAnswer(selected : string){
    this.currentQuestion.selected_answer = selected;
  }
}

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
