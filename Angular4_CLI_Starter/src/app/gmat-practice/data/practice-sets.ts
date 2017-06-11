import {QuestionType, Status} from "../../models/constants.enum";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";
export class PracticeData {
  // Structure: 'practice name', 'number of questions', 'status', 'link to file', 'last time of major change in file'
  static DATA = [
    ['OG15-CR',124,Status.ACTIVE, 'assets/practices/OG15/cr.txt',0],
    ['OG15-SC',140,Status.ACTIVE, 'assets/practices/OG15/sc.txt',0],
    ['OG15-RC',144,Status.ACTIVE, 'assets/practices/OG15/rc.txt',0],
    ['VR15-CR',83,Status.ACTIVE, 'assets/practices/VR15/cr.txt',0],
    ['VR15-SC',144,Status.ACTIVE, 'assets/practices/VR15/sc.txt',0],
    ['VR15-RC',104,Status.ACTIVE, 'assets/practices/VR15/rc.txt',0],
    ['QP1-CR',75,Status.ACTIVE, 'assets/practices/QP1/cr.txt',0],
    ['QP1-SC',75,Status.ACTIVE, 'assets/practices/QP1/sc.txt',0]
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
      let lines = e.split("\n");
      let questionInfo = (lines[1] as string).split("#").filter(e => e.trim() != "");

      let question = new Question();
      if(questionInfo[0] == "CR"){
        question.question_type = QuestionType.CRITICAL_REASONING;
      }
      else if(questionInfo[0] == "SC"){
        question.question_type = QuestionType.SENTENCE_CORRECTION;
      }
      else if(questionInfo[0] == "RC"){
        question.question_type = QuestionType.READING_COMPREHENSION;
      }

      question.question_number = questionInfo[1];
      question.correct_answer = questionInfo[2];
      question.question_time = 0;

      let questionStemStart = 2;
      if(question.question_type == QuestionType.READING_COMPREHENSION){
        question.reading_passage = lines[2];
        questionStemStart = 3;
      }

      question.question_stem = lines[questionStemStart];
      question.option_A = lines[questionStemStart+1].slice(4);
      question.option_B = lines[questionStemStart+2].slice(4);
      question.option_C = lines[questionStemStart+3].slice(4);
      question.option_D = lines[questionStemStart+4].slice(4);
      question.option_E = lines[questionStemStart+5].slice(4);

      PracticeData.safeGuardQuestion(lines[questionStemStart+1]);
      PracticeData.safeGuardQuestion(lines[questionStemStart+2]);
      PracticeData.safeGuardQuestion(lines[questionStemStart+3]);
      PracticeData.safeGuardQuestion(lines[questionStemStart+4]);
      PracticeData.safeGuardQuestion(lines[questionStemStart+5]);

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
