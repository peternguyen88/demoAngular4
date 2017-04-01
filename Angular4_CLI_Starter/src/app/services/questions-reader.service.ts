import {Injectable} from "@angular/core";
import {AbstractQuestion} from "../models/abstract-question";
import {CriticalReasoningQuestion} from "../models/critical-reasoning.question";
/**
 * Read questions from Text File or From Other sources that would be added later
 */
@Injectable()
export class QuestionReaderService{
  static readQuestions() : AbstractQuestion[]{
    let question = new CriticalReasoningQuestion();
    question.question_stem = "This is a question stem";
    question.question_number = 1;
    question.option_A = "Option A";
    question.option_B = "Option B";
    question.option_C = "Option C";
    question.option_D = "Option D";
    question.option_E = "Option E";
    question.question_stimulus = "This is stimulus";

    let questions : AbstractQuestion[] = [];
    questions.push(question);

    return questions;
  }
}
