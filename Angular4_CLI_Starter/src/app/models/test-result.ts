import {GMATTest} from "./gmat-test";
import {Question} from "./question";

export class TestResult{
  constructor(test: GMATTest){
    this.testName = test.testName;
    this.numberOfQuestions = test.numberOfQuestions;
    this.questions = [];
    test.questions.filter(e => e.selected_answer).forEach(e => {
      this.numberOfAnsweredQuestions++;
      this.questions.push(new QuestionResult(e));
    });
    this.isTestFinished = this.numberOfQuestions == this.numberOfAnsweredQuestions;
  }

  testName: string;
  numberOfQuestions: number;
  numberOfAnsweredQuestions = 0;
  questions: QuestionResult[];
  isTestFinished: boolean;
}

export class QuestionResult{
  constructor(question: Question){
    this.question_number = question.question_number;
    this.selected_answer = question.selected_answer;
    this.is_correct = question.isCorrect();
    this.question_time = question.question_time;
  }
  question_number: string;
  selected_answer: string;
  question_time: number;
  is_correct: boolean;
}
