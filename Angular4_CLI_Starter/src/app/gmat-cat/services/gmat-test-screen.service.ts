/**
 * All Data used by Test Screen or Summary Screen will be shared using TestScreenService
 */
import {Injectable} from "@angular/core";
import {GMATTest} from "../../models/gmat-test";
import {Question} from "../../models/question";
import {Http} from "@angular/http";
import {QuestionType} from "../../models/constants.enum";

@Injectable()
export class TestScreenService {
    isStarted : boolean;
    isPaused : boolean;
    currentTest : GMATTest;
    remainingTime : number;

    currentQuestionIndex : number;
    currentQuestionTime : number;

    constructor(private http: Http) { }

    public start(){
      this.isStarted = true;
      this.isPaused = false;
      this.currentQuestionTime = 0;
      this.currentQuestionIndex = 0;
    }

    public pauseOrResume() {
      this.isPaused = !this.isPaused;
    }

    public stop(){
      this.isStarted = false;
      this.isPaused = true;
    }

    public nextQuestion(){
      if(this.currentQuestionIndex < this.currentTest.numberOfQuestions - 1){
        this.currentQuestionIndex++;
      }
    }

    public getCurrentQuestion():Question{
      return this.currentTest.questions[this.currentQuestionIndex];
    }

    public setCurrentTest(test : GMATTest){
      this.currentTest = test;
      if(this.currentTest!=null) {
        this.loadQuestionsFromServer();
      }
    }

    private loadQuestionsFromServer(){
      this.http.get(this.currentTest.fileLocation).subscribe(response =>{
        if(response.ok) {
          this.processTestFile(response.text());
        }
      });
    }

    private processTestFile(testContent : string){
      let lines : string[] = testContent.split("\n");
      lines.pop(); // Remove Last Line
      // Line 1 - Number of Questions
      this.currentTest.numberOfQuestions = Number(lines[0].replace("####",""));
      console.log(this.currentTest.numberOfQuestions);
      let numberOfLines = lines.length;
      let currentLineIndex = 1;
      let currentQuestionIndex = 1;
      while(currentLineIndex < numberOfLines){
        // First Line is Question Type
        let question = new Question();
        if(lines[currentLineIndex] == "#SC#"){
          console.log("SC");
          question.question_type = QuestionType.SENTENCE_CORRECTION;
        }
        if(lines[currentLineIndex] == "#CR#"){
          console.log("CR");
          question.question_type = QuestionType.CRITICAL_REASONING;
        }
        if(lines[currentLineIndex] == "#RC#"){
          console.log("RC");
          question.question_type = QuestionType.READING_COMPREHENSION;
          question.reading_passage = lines[++currentLineIndex].replace("#R#","");
        }

        currentLineIndex++;

        question.question_number = currentQuestionIndex++;
        question.question_stem = lines[currentLineIndex++].replace("#Q#","");
        question.option_A = lines[currentLineIndex++].replace("#O#(A) ","").replace("#O#A. ","");
        question.option_B = lines[currentLineIndex++].replace("#O#(B) ","").replace("#O#B. ","");
        question.option_C = lines[currentLineIndex++].replace("#O#(C) ","").replace("#O#C. ","");
        question.option_D = lines[currentLineIndex++].replace("#O#(D) ","").replace("#O#D. ","");
        question.option_E = lines[currentLineIndex++].replace("#O#(E) ","").replace("#O#E. ","");
        question.correct_answer = lines[currentLineIndex++].replace("#A#","");

        console.log(question);
        this.currentTest.questions.push(question);
      }
    }

    public backToSummary(){
      this.currentTest = null;
    }
}
