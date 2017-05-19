import {QuestionType, Status} from "../../models/constants.enum";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";
export class PracticeData {
  static DATA = [
    ['OG15-CR',125,Status.ACTIVE, 'assets/practices/OG15/cr.txt'],
    ['OG15-SC',125,Status.ACTIVE, 'assets/practices/OG15/sc.txt']
  ];

  static practices:GMATPractice[];

  public static getAllPracticeSets(): GMATPractice[] {
    if (PracticeData.practices == null) {
      PracticeData.practices = [];

      PracticeData.DATA.forEach(e => {
        let practice = new GMATPractice();
        practice.practiceName = e[0] as string;
        practice.numberOfQuestions = e[1] as number;
        practice.status = e[2] as Status;
        practice.fileLocation = e[3] as string;

        PracticeData.practices.push(practice);
      });
    }
    return PracticeData.practices;
  }

  public static processQuestionFile(practice:GMATPractice, fileContent:string){
    let questions : Question[] = [];
    let data = fileContent.slice(fileContent.indexOf("\n")).split("---------------------------------").filter(e => e.trim() != "");

    data.forEach(e => {
      console.log("------------------");
      let lines = e.split("\n");
      let questionInfo = (lines[1] as string).split("#").filter(e => e.trim() != "");

      let question = new Question();

      if(questionInfo[1] == "CR"){
        question.question_type = QuestionType.CRITICAL_REASONING;
      }
      else if(questionInfo[1] == "SC"){
        question.question_type = QuestionType.SENTENCE_CORRECTION;
      }
      else if(questionInfo[1] == "RC"){
        question.question_type = QuestionType.READING_COMPREHENSION;
      }

      question.question_number = questionInfo[1];
      question.correct_answer = questionInfo[2];
      question.question_time = 0;

      question.question_stem = lines[2];
      question.option_A = lines[3].slice(4);
      question.option_B = lines[4].slice(4);
      question.option_C = lines[5].slice(4);
      question.option_D = lines[6].slice(4);
      question.option_E = lines[7].slice(4);

      PracticeData.safeGuardQuestion(lines[3]);
      PracticeData.safeGuardQuestion(lines[4]);
      PracticeData.safeGuardQuestion(lines[5]);
      PracticeData.safeGuardQuestion(lines[6]);
      PracticeData.safeGuardQuestion(lines[7]);

      questions.push(question);
    });

    practice.numberOfQuestions = questions.length;
    practice.questions = questions;
  }

  static safeGuardQuestion(option: string){
    if(option.slice(3,4) != " "){
      console.log("Issue:"+option);
    }
  }
}
