import {Status, TestMode, TestType} from "../../models/constants.enum";
/**
 * Created by Peter on 4/4/2017.
 */
export class TestInfo {
  static DATA = [
    ['Verbal Test 01', TestType.VERBAL, 41, 'Hard', 75, Status.ACTIVE, 'assets/tests/testFile.txt', TestMode.TEST],
    ['Verbal Test 02', TestType.VERBAL, 41, 'Medium', 75, Status.LOCKED, 'assets/tests/testFile.txt', TestMode.TEST],
  ];
}
