import {Status} from "./constants.enum";
import {Question} from "./question";

export class GMATPractice {
  numberOfQuestions: number;
  practiceName: string;
  practiceFullName: string;
  status: Status;
  fileLocation: string;
  questions: Question[] = [];
  hasExplanation: boolean;
  allowedTime : number;

  isTest():boolean{
    return this.status == Status.TEST;
  }

  getExplanationLocation() : string{
    return this.fileLocation.substring(0, this.fileLocation.lastIndexOf(".")) + "-explanation" + this.fileLocation.substring(this.fileLocation.lastIndexOf("."));
  }
}
