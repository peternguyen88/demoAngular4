import {Injectable} from "@angular/core";
import {GMATTest} from "../models/gmat-test";
import {Status, TestType} from "../models/constants.enum";
import {TestInfo} from "../gmat-cat/services/test-info";
/**
 * Fetch all available Test from Database
 */
@Injectable()
export class GMATTestService {
  static tests: GMATTest[] = [];

  public static getAllTests(): GMATTest[] {
    if (GMATTestService.tests.length == 0) {
      TestInfo.DATA.forEach(e => {
        let test = new GMATTest(TestType[e[1]]);
        test.testName = e[0] as string;
        test.numberOfQuestions = e[2] as number;
        test.testDifficulty = e[3] as string;
        test.allowedTime = e[4] as number * 60;
        test.status = Status[e[5]];
        test.fileLocation = e[6] as string;
        GMATTestService.tests.push(test);
      });
    }

    return GMATTestService.tests;
  }
}
