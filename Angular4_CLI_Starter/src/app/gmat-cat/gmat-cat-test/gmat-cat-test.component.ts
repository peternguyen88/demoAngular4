/**
 * Test Screen, which will display question for user to answer
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnumTestStage, TestMode} from "../../models/constants.enum";
import {GMATTest} from "../../models/gmat-test";
import {TestScreenService} from "../services/gmat-test-screen.service";

@Component({
    moduleId: module.id,
    selector: 'gmat-cat-test',
    templateUrl: 'gmat-cat-test.component.html',
})
export class GmatCatTestComponent {
    EnumTestStage: typeof EnumTestStage = EnumTestStage;
    testStage : EnumTestStage;

    currentTest : GMATTest;

    constructor(public testScreenService : TestScreenService) {
      this.testStage = EnumTestStage.WELCOME;
      this.currentTest = testScreenService.currentTest;
    }

    public onTestStart(): void {
      this.testStage = EnumTestStage.STARTED;
      this.testScreenService.start();
    }

    public onTestEnd(): void {
      this.testStage = EnumTestStage.FINISHED;
    }

    public onReview(): void{
      this.testStage = EnumTestStage.REVIEW;
    }
}
