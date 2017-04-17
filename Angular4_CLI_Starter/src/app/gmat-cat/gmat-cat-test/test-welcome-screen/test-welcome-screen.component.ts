/**
 * Static Welcome Screen Before User Takes Test
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {TestScreenService} from "../../services/gmat-test-screen.service";
import {EnumTestStage} from "../../../models/constants.enum";

@Component({
    moduleId: module.id,
    selector: 'test-welcome-screen',
    templateUrl: 'test-welcome-screen.component.html'
})
export class TestWelcomeScreenComponent{
    @Output() testStart = new EventEmitter();

    constructor(private testScreenService: TestScreenService) { }

    public onTestStart() : void{
      // this.testStart.emit();
      this.testScreenService.start();
    }

    public onBackToSummary(){
      this.testScreenService.backToSummary();
}
}
