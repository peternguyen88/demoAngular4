import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import * as firebase from "firebase/app";
import {FirebaseUtil} from "./firebase.util";
import {FirebasePerformanceSummary, FirebaseUser, UserQuestionReport} from "../models/firebase.model";
import {PracticeResult, QuestionResult, TestResult} from "../models/test-result";
import {TestInfo} from "../gmat-cat/services/test-info";
import {PracticeData} from "../gmat-practice/data/practice-sets";

@Injectable()
export class FirebaseDatabaseService{

  userObject: FirebaseObjectObservable<FirebaseUser>;
  user: firebase.User;
  firebaseUser: FirebaseUser;

  constructor(private db: AngularFireDatabase){}

  /**
   * Update user info (Email, Name, Login Count, Last Login Time)
   * @param user
   */
  public onAuthenticationStateChanged(user: firebase.User){
    this.user = user;
    if(user){
      let userIdentification = user.email ? user.email : user.providerData[0].uid;
      this.userObject = this.db.object(FirebaseUtil.userPath(userIdentification));
      this.userObject.take(1).subscribe(data => {
        let isUserExist = data.$exists();
        // Create User Object
        if(isUserExist){
          this.firebaseUser = data;
          if(this.firebaseUser.uid == null) {
            this.firebaseUser.uid = user.providerData[0].uid;
            this.firebaseUser.firebase_uid = user.uid;
          }
          if(this.firebaseUser.is_student == null){
            this.firebaseUser.is_student = false;
          }
        }else{
          this.firebaseUser = new FirebaseUser(user.email, user.displayName, user.providerData[0].uid);
          this.firebaseUser.firebase_uid = user.uid;
        }
        this.firebaseUser.login_count++;
        this.firebaseUser.last_login = new Date().toString();
        this.userObject.set(this.firebaseUser).then(error => {if(error) console.log(error)});

        // this.userObject.set(this.firebaseUser);
        // Push Everything saved locally to server
        if(!isUserExist) this.firstTimeLoginProcess();
      });

    }else{
      this.userObject = null;
    }
  }

  public processRetrievePerformanceFromServer(id: string, localSavedTime: number, mergeData: (questions: QuestionResult[]) => any){
    if(this.isLogin()) {
      let last_saved_timeObject: FirebaseObjectObservable<number> = this.db.object(FirebaseUtil.performancePathLastSavedTime(this.getUserIdentification(), id));
      last_saved_timeObject.take(1).subscribe(last_saved_time => {
        console.log(last_saved_time);
        if (last_saved_time.$exists() && last_saved_time.$value > localSavedTime) {// Server Version is newer than local version
          let questionList: FirebaseListObservable<QuestionResult[]> = this.db.list(FirebaseUtil.performancePathDetail(this.getUserIdentification(), id));
          questionList.take(1).subscribe(questions => {
            if (questions.length > 0) {
              mergeData(questions);
            }
          });
        }
      });
    }
  }

  public firstTimeLoginProcess(){
    // Upload Test Data
    TestInfo.DATA.forEach(e => {
      let testName = e[0] as string;
      if(localStorage.getItem(testName)){
        let testResult = JSON.parse(localStorage.getItem(testName)) as TestResult;
        let lastSavedTime = testResult.lastSavedTime ? testResult.lastSavedTime : new Date().getTime();
        this.processSavePerformanceToServer(testName, lastSavedTime, testResult.questions);
      }
    });
    // Upload Practice Data
    PracticeData.DATA.forEach(e => {
      let practiceName = e[0] as string;
      if(localStorage.getItem(practiceName)){
        let practiceResult = JSON.parse(localStorage.getItem(practiceName)) as PracticeResult;
        this.processSavePerformanceToServer(practiceName, practiceResult.lastSavedTime, practiceResult.questions);
      }
    });
  }

  public processSavePerformanceToServer(id: string, localSavedTime: number, questions: QuestionResult[]){
    if(this.isLogin()) {
      console.log("Save data to server");
      // ============= Save Summary =====================
      let summary = new FirebasePerformanceSummary();
      summary.id = id;
      summary.total_questions = questions.length;
      summary.last_saved_time = localSavedTime;
      summary.last_saved = new Date().toString();
      let answeredQuestions = questions.filter(e => e.selected_answer);
      answeredQuestions.forEach(e => {
        summary.answered_questions += 1;
        summary.correct_questions += e.is_correct ? 1 : 0;
        summary.total_time += e.question_time;
      });
      this.db.object(FirebaseUtil.performancePathSummary(this.getUserIdentification(), id)).set(summary).then(error => {if(error) console.log(error)});
      // ============== Save Detail =======================
      answeredQuestions.forEach(e => FirebaseUtil.cleanQuestionResultForSaving(e)); // Remove undefined property before saving to server.
      this.db.object(FirebaseUtil.performancePathDetail(this.getUserIdentification(), id)).set(answeredQuestions).then(error => {if(error) console.log(error)});
    }
  }

  public deleteSavedPerformanceFromServer(id: string){
    if(this.isLogin()){
      this.db.object(FirebaseUtil.performancePath(this.getUserIdentification(), id)).remove();
    }
  }

  public reportQuestion(report: UserQuestionReport){
    let questionSet = report.question_set;
    delete report.question_set;
    this.db.list(FirebaseUtil.reportPathDetail(questionSet)).push(report);
  }

  private isLogin(): boolean{
    return this.userObject != null;
  }

  public isUnlockFeature():boolean{
    return this.firebaseUser.unlock_feature;
  }

  public isStudent():boolean{
    return this.firebaseUser && this.firebaseUser.is_student;
  }

  public getUserIdentification():string{
    return this.user.email ? this.user.email : this.user.providerData[0].uid;
  }
}
