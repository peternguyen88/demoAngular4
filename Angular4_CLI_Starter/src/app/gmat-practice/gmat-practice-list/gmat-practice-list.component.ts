/**
 * Summary Screen - Showing a list of test for user to choose
 */
import {Component} from "@angular/core";
import {PracticeService} from "../gmat-practice.service";
import {GMATPractice} from "../../models/gmat-practice";
import {PracticeData} from "../data/practice-sets";

@Component({
  moduleId: module.id,
  selector: 'gmat-practice-list',
  templateUrl: 'gmat-practice-list.component.html'
})
export class GMATPracticeListComponent {
  practiceSets: GMATPractice[];

  constructor(private practiceService: PracticeService) {
    this.practiceSets = PracticeData.getAllPracticeSets();
  }

  selectPracticeSet(practice: GMATPractice){
    this.practiceService.selectPracticeSet(practice);
  }
}
