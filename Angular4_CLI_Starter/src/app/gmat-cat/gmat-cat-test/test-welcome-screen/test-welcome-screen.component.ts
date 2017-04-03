/**
 * Static Welcome Screen Before User Takes Test
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'test-welcome-screen',
    templateUrl: 'test-welcome-screen.component.html'
})
export class TestWelcomeScreenComponent{
    @Output() testStart = new EventEmitter();
    @Output() backToSummary = new EventEmitter();

    constructor() { }

    public onTestStart() : void{
      this.testStart.emit();
    }

    public onBackToSummary() : void {
      this.backToSummary.emit();
    }
}
