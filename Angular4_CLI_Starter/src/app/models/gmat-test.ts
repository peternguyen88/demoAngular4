import {Status, TestType} from "./constants.enum";
import {AbstractQuestion} from "./abstract-question";
/**
 * GMATTest class - There are two types of test. Quant - 37 questions & Verbal - 41 questions
 */
export class GMATTest {
  testType: TestType;
  numberOfQuestions: number;
  testName: string;
  testDifficulty: string;
  status: Status;
  fileLocation: string;
  questions: AbstractQuestion[];

  constructor(testType: TestType) {
    this.testType = testType;
    if (testType == TestType.VERBAL) {
      this.numberOfQuestions = 41;
    }
    else if (testType == TestType.QUANTITATIVE) {
      this.numberOfQuestions = 37;
    }
  }

  public isActive(): boolean {
    return this.status == Status.ACTIVE;
  }
}
