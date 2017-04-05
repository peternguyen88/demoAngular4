/**
 * Display Test To User
 */
import {Component, EventEmitter, Output} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {Question} from "../../../models/question";

@Component({
    moduleId: module.id,
    selector: 'test-screen',
    templateUrl: 'test-screen.component.html',
    styleUrls: ['test-screen.component.css']
})
export class TestScreenComponent{
    currentQuestion : Question;
    constructor(private testScreenService: TestScreenService) {
      this.currentQuestion = this.testScreenService.getCurrentQuestion();
    }

    public nextQuestion(){
      this.testScreenService.nextQuestion();
      this.currentQuestion = this.testScreenService.getCurrentQuestion();
    }

    public backToSummary() : void {
      this.testScreenService.backToSummary();
    }
}
