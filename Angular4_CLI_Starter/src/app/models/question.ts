import {QuestionType} from "./constants.enum";
/**
 * We don't put question here because SC doesn't have question. RC also have reading. CR sometimes has question stem
 * before stimulus.
 */
export class Question {
  question_number: number;
  question_type: QuestionType;
  question_stem: string;
  reading_passage: string;
  question_difficulty: string;
  question_time: number;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  option_E: string;
  selected_answer: string;
  correct_answer: string;
  bookmarked: boolean = false;

  public isCorrect(): boolean {
    return this.selected_answer == this.correct_answer;
  }

  public isCriticalReasoning() : boolean {
    return this.question_type == QuestionType.CRITICAL_REASONING;
  }

  public isSentenceCorrection() : boolean {
    return this.question_type == QuestionType.SENTENCE_CORRECTION;
  }

  public isReadingComprehension() : boolean {
    return this.question_type == QuestionType.READING_COMPREHENSION;
  }
}
