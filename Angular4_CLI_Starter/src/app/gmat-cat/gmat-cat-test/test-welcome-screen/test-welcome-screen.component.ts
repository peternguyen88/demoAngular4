/**
 * Static Welcome Screen Before User Takes Test
 */
import {Component} from "@angular/core";
import {TestScreenService} from "../../services/gmat-test-screen.service";

@Component({
    moduleId: module.id,
    selector: 'test-welcome-screen',
    templateUrl: 'test-welcome-screen.component.html'
})
export class TestWelcomeScreenComponent{
    constructor(private testScreenService: TestScreenService) { }

    public onTestStart() : void{
      this.testScreenService.start();
    }

    public onBackToSummary(){
      this.testScreenService.backToSummary();
}
}
