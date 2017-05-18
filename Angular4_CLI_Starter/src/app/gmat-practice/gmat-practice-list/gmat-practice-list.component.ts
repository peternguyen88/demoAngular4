/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../gmat-practice.service";

@Component({
    moduleId: module.id,
    selector: 'gmat-practice-list',
    templateUrl: 'gmat-practice-list.component.html'
})
export class GMATPracticeListComponent {
    constructor(private practiceService: PracticeService) {

    }
}
