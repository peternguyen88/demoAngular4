/**
 * Display Test To User
 */
import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'test-screen',
    templateUrl: 'test-screen.component.html',
    styleUrls: ['test-screen.component.css']
})
export class TestScreenComponent{
    @Output() backToSummary = new EventEmitter();

    constructor() { }

    public onBackToSummary() : void {
      this.backToSummary.emit();
    }
}
