import {Injectable} from "@angular/core";
import {GMATTest} from "../models/gmat-test";
import {Status, TestType} from "../models/constants.enum";
/**
 * Fetch all available Test from Database
 */
@Injectable()
export class GMATTestService {
  public getAllTests() : GMATTest[]{
    const sampleTest = new GMATTest(TestType.VERBAL);
    sampleTest.testName = "Verbal Test 01";
    sampleTest.testDifficulty = "Medium";
    sampleTest.status = Status.ACTIVE;

    const test2 = new GMATTest(TestType.VERBAL);
    test2.testName = "Verbal Test 02";
    test2.testDifficulty = "Hard";
    test2.status = Status.LOCKED;

    let tests : GMATTest[] = [];
    tests.push(sampleTest);
    tests.push(test2);

    return tests;
  }
}
