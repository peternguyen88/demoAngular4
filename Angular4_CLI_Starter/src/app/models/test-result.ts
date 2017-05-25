import {GMATTest} from "./gmat-test";
import {Question} from "./question";
import {GMATPractice} from "./gmat-practice";

export class TestResult {
  constructor(test: GMATTest) {
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

export class PracticeResult {
  practiceName: string;
  numberOfQuestions: number;
  numberOfAnsweredQuestions = 0;
  questions: QuestionResult[];
  lastSavedTime: number;

  constructor(practice: GMATPractice) {
    this.practiceName = practice.practiceName;
    this.numberOfQuestions = practice.numberOfQuestions;
    this.questions = [];
    practice.questions.forEach(e => {
      if(e.selected_answer) this.numberOfAnsweredQuestions++;
      this.questions.push(new QuestionResult(e));
    });
    this.lastSavedTime = new Date().getTime();
  }

  public static mergeResult(result: PracticeResult, practice: GMATPractice) : void{
    for(let i = 0; i < practice.questions.length; i++){
      if(practice.questions[i].selected_answer){
        result.questions[i].selected_answer = practice.questions[i].selected_answer;
        result.questions[i].question_time = practice.questions[i].question_time;
        result.questions[i].is_correct = practice.questions[i].isCorrect();
        result.questions[i].bookmarked = practice.questions[i].bookmarked;
        result.questions[i].remarks = practice.questions[i].remarks;
      }
    }
    result.lastSavedTime = new Date().getTime();
  }

  public static mergeResultToPractice(practice: GMATPractice, result: PracticeResult) : void{
    for(let i = 0; i < practice.questions.length; i++){
      if(result.questions[i].selected_answer){
        practice.questions[i].selected_answer = result.questions[i].selected_answer;
        practice.questions[i].question_time = result.questions[i].question_time;
        practice.questions[i].bookmarked = result.questions[i].bookmarked;
        practice.questions[i].remarks = result.questions[i].remarks;
      }
    }
    result.lastSavedTime = new Date().getTime();
  }
}

export class QuestionResult {
  constructor(question: Question) {
    this.question_number = question.question_number;
    this.selected_answer = question.selected_answer;
    this.is_correct = question.isCorrect();
    this.question_time = question.question_time;
    this.bookmarked = question.bookmarked;
    this.remarks = question.remarks;
  }

  question_number: string;
  selected_answer: string;
  question_time: number;
  is_correct: boolean;
  bookmarked: boolean;
  remarks: string;
}
