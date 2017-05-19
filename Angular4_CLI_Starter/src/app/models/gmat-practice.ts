import {Status} from "./constants.enum";
import {Question} from "./question";
export class GMATPractice {
  numberOfQuestions: number;
  practiceName: string;
  status: Status;
  fileLocation: string;
  questions: Question[] = [];

  isActive():boolean{
    return this.status == Status.ACTIVE;
  }
}
