import {AbstractQuestion} from "./abstract-question";
import {QuestionType} from "./question-type.enum";
/**
 * Critical Reasoning Question - Verbal
 */
export class CriticalReasoningQuestion extends AbstractQuestion{
  question_stimulus : string;
  public getQuestionDisplay(): string {
    throw new Error('Method not implemented.');
  }

  constructor(){
    super();
    this.question_type = QuestionType.CRITICAL_REASONING;
  }
}
