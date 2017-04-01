import {QuestionType} from "./question-type.enum";
/**
 * We don't put question here because SC doesn't have question. RC also have reading. CR sometimes has question stem
 * before stimulus.
 */
export abstract class AbstractQuestion {
  question_number: number;
  question_type: QuestionType;
  question_stem: string;
  question_difficulty: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  option_E: string;
  selected_answer: string;
  correct_answer: string;

  public abstract getQuestionDisplay(): string;

  public isCorrect(): boolean {
    return this.selected_answer == this.correct_answer;
  }
}
