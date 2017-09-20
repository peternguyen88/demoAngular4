import {QuestionType, Status} from "../../models/constants.enum";
import {GMATPractice} from "../../models/gmat-practice";
import {Question} from "../../models/question";
export class PracticeData {
  // Structure: 'practice name', 'number of questions', 'status', 'link to file', 'last time of major change in file'
  static DATA = [
    ['OG15-CR',124,Status.ACTIVE, 'assets/practices/OG15/cr.txt',0, 'Official Guide 2015 - CR'],
    ['OG15-SC',140,Status.ACTIVE, 'assets/practices/OG15/sc.txt',0, 'Official Guide 2015 - SC'],
    ['OG15-RC',144,Status.ACTIVE, 'assets/practices/OG15/rc.txt',0, 'Official Guide 2015 - RC'],
    ['VR15-CR',83,Status.ACTIVE, 'assets/practices/VR15/cr.txt',0, 'Verbal Review 2015 - CR'],
    ['VR15-SC',144,Status.ACTIVE, 'assets/practices/VR15/sc.txt',0, 'Verbal Review 2015 - SC'],
    ['VR15-RC',104,Status.ACTIVE, 'assets/practices/VR15/rc.txt',0, 'Verbal Review 2015 - RC'],
    ['QP1-CR',75,Status.ACTIVE, 'assets/practices/QP1/cr.txt',0, 'Question Pack 1 - CR'],
    ['QP1-SC',75,Status.ACTIVE, 'assets/practices/QP1/sc.txt',0, 'Question Pack 1 - SC'],
    ['QP1-RC',75,Status.ACTIVE, 'assets/practices/QP1/rc.txt',0, 'Question Pack 1 - RC']
  ];

  static PREMIUM_DATA = [
    ['OG16',102,Status.ACTIVE, 'assets/premium/og16.txt',0, 'Official Guide 2016'],
    ['VR16',76,Status.ACTIVE, 'assets/premium/vr16.txt',0, 'Verbal Review 2016'],
    ['OG17',61,Status.ACTIVE, 'assets/premium/og17.txt',0, 'Official Guide 2017'],
    ['VR17',45,Status.ACTIVE, 'assets/premium/vr17.txt',0, 'Verbal Review 2017'],
    ['OG18',61,Status.ACTIVE, 'assets/premium/og18.txt',0, 'Official Guide 2018'],
    ['VR18',42,Status.ACTIVE, 'assets/premium/vr18.txt',0, 'Verbal Review 2018'],
  ];

  static COMPREHENSIVE_SC = [
    ['COM-SC-01',84,Status.ACTIVE, 'assets/comprehensive/sc_01.txt',0, 'SC Comprehensive - Part I'],
    ['COM-SC-02',84,Status.ACTIVE, 'assets/comprehensive/sc_02.txt',0, 'SC Comprehensive - Part II'],
    ['COM-SC-03',84,Status.ACTIVE, 'assets/comprehensive/sc_03.txt',0, 'SC Comprehensive - Part III'],
    ['COM-SC-04',84,Status.ACTIVE, 'assets/comprehensive/sc_04.txt',0, 'SC Comprehensive - Part IV'],
    ['COM-SC-05',83,Status.ACTIVE, 'assets/comprehensive/sc_05.txt',0, 'SC Comprehensive - Part V'],
  ];

  static practices:GMATPractice[];

  public static getAllPracticeSets(): GMATPractice[] {
    if (PracticeData.practices == null) {
      PracticeData.practices = [];

      PracticeData.DATA.forEach(e => {
        PracticeData.practices.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.practices;
  }

  static premiumSets:GMATPractice[];

  public static getAllPremiumSets(): GMATPractice[] {
    if (PracticeData.premiumSets == null) {
      PracticeData.premiumSets = [];

      PracticeData.PREMIUM_DATA.forEach(e => {
        PracticeData.premiumSets.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.premiumSets;
  }

  static comprehensiveSC:GMATPractice[];

  public static getComprehensiveSC(): GMATPractice[]{
    if (PracticeData.comprehensiveSC == null) {
      PracticeData.comprehensiveSC = [];
      PracticeData.COMPREHENSIVE_SC.forEach(e => {
        PracticeData.comprehensiveSC.push(PracticeData.buildPractice(e));
      });
    }
    return PracticeData.comprehensiveSC;
  }

  private static buildPractice(e) {
    let practice = new GMATPractice();
    practice.practiceName = e[0] as string;
    practice.numberOfQuestions = e[1] as number;
    practice.status = e[2] as Status;
    practice.fileLocation = e[3] as string;
    if(e.length >= 5)
      practice.practiceFullName = e[5] as string;
    return practice;
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
