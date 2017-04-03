/**
 * Test Screen, which will display question for user to answer
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnumTestStage} from "../../models/constants.enum";
import {GMATTest} from "../../models/gmat-test";

@Component({
    moduleId: module.id,
    selector: 'gmat-cat-test',
    templateUrl: 'gmat-cat-test.component.html'
})
export class GmatCatTestComponent {
    EnumTestStage: typeof EnumTestStage = EnumTestStage;
    testStage : EnumTestStage;

    @Input() currentTest : GMATTest;
    @Output() backToSummary = new EventEmitter();

    constructor() {
      this.testStage = EnumTestStage.WELCOME;
    }

    public onBackToSummary() : void{
      this.backToSummary.emit();
    }

    public onTestStart() : void {
      this.testStage = EnumTestStage.STARTED;
    }

    public onTestPause() : void {
      this.testStage = EnumTestStage.PAUSED;
    }
}
