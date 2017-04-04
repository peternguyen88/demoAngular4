import {Status, TestType} from "../../models/constants.enum";
/**
 * Created by Peter on 4/4/2017.
 */
export class TestInfo {
  static DATA = [
    ['Verbal Test 01', TestType.VERBAL, 41, 'Hard', Status.ACTIVE, 'assets/tests/testFile.txt'],
    ['Verbal Test 02', TestType.VERBAL, 41, 'Medium', Status.LOCKED, 'assets/tests/testFile.txt'],
  ];
}
