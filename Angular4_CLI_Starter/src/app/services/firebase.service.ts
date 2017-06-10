import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";
import * as firebase from "firebase/app";
import {FirebaseUtil} from "./firebase.util";
import {FirebasePerformanceSummary, FirebaseUser} from "../models/firebase.model";
import {PracticeResult, QuestionResult, TestResult} from "../models/test-result";
import {TestInfo} from "../gmat-cat/services/test-info";
import {PracticeData} from "../gmat-practice/data/practice-sets";

@Injectable()
export class FirebaseService{

  userObject: FirebaseObjectObservable<FirebaseUser>;

  constructor(private db: AngularFireDatabase, private fireAuth: AngularFireAuth){
    this.fireAuth.auth.onAuthStateChanged((user) => {
      this.processUser(user);
    });
  }

  /**
   * Update user info (Email, Name, Login Count, Last Login Time)
   * @param user
   */
  private processUser(user: firebase.User){
    if(user){
      this.userObject = this.db.object(FirebaseUtil.userPath(user.email));
      let firebaseUser : FirebaseUser;
      this.userObject.take(1).subscribe(data => {
        let isUserExist = data.$exists();
        // Create User Object
        if(isUserExist){
          firebaseUser = data;
        }else{
          firebaseUser = new FirebaseUser(user.email, user.displayName);
        }
        firebaseUser.login_count++;
        firebaseUser.last_login = new Date().toString();
        this.userObject.set(firebaseUser).then(error => {if(error) console.log(error)});

        this.userObject.set(firebaseUser);
        // Push Everything saved locally to server
        if(!isUserExist) this.firstTimeLoginProcess();
      });

    }else{
      this.userObject = null;
    }
  }

  public processRetrievePerformanceFromServer(id: string, localSavedTime: number, mergeData: (questions: QuestionResult[]) => any){
    if(this.isLogin()) {
      let last_saved_timeObject: FirebaseObjectObservable<number> = this.db.object(FirebaseUtil.performancePathLastSavedTime(this.getCurrentEmail(), id));
      last_saved_timeObject.take(1).subscribe(last_saved_time => {
        console.log(last_saved_time);
        if (last_saved_time.$exists() && last_saved_time.$value > localSavedTime) {// Server Version is newer than local version
          let questionList: FirebaseListObservable<QuestionResult[]> = this.db.list(FirebaseUtil.performancePathDetail(this.getCurrentEmail(), id));
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
      this.db.object(FirebaseUtil.performancePathSummary(this.getCurrentEmail(), id)).set(summary).then(error => {if(error) console.log(error)});
      // ============== Save Detail =======================
      answeredQuestions.forEach(e => FirebaseUtil.cleanQuestionResultForSaving(e)); // Remove undefined property before saving to server.
      this.db.object(FirebaseUtil.performancePathDetail(this.getCurrentEmail(), id)).set(answeredQuestions).then(error => {if(error) console.log(error)});
    }
  }

  public deleteSavedPerformanceFromServer(id: string){
    if(this.isLogin()){
      this.db.object(FirebaseUtil.performancePath(this.getCurrentEmail(), id)).remove();
    }
  }

  public getUserObservable():Observable<firebase.User>{
    return this.fireAuth.authState;
  }

  public getCurrentUser():firebase.User{
    return this.fireAuth.auth.currentUser;
  }

  public getCurrentEmail(): string{
    return this.getCurrentUser().email;
  }

  login(){
    this.fireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logout(){
    this.fireAuth.auth.signOut();
  }

  public isLogin():boolean{
    return this.fireAuth.auth.currentUser != null;
  }
}
