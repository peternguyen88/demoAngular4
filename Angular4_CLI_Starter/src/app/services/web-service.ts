import {Injectable} from "@angular/core";
import {FirebaseDatabaseService} from "./firebase.database.service";
import {QuestionResult} from "../models/test-result";
import {FirebaseAuthenticationService} from "./firebase.authentication.service";
import * as firebase from "firebase/app";
import {RestAPIService} from "./rest.api.service";


/**
 * Use the service to work with multiple Http services: Firebase, Lumen
 */
@Injectable()
export class WebService {

  constructor(private fbDatabaseService: FirebaseDatabaseService, private fbAuthService: FirebaseAuthenticationService, private restAPIService: RestAPIService) {
    // this.subscribeOnAuthStateChanged(user => fbDatabaseService.onAuthenticationStateChanged(user));
    this.subscribeOnAuthStateChanged(user => restAPIService.onAuthenticationStateChanged(user));
  }

  public subscribeOnAuthStateChanged(subscribeFunction : (user: firebase.User) => void) {
    this.fbAuthService.subscribeOnAuthStateChanged(user => subscribeFunction(user));
  }

  public login(){
    this.fbAuthService.login();
  }

  public logout(){
    this.fbAuthService.logout();
  }

  public isLogin():boolean{
    return this.fbAuthService.isLogin();
  }

  public getCurrentUser():firebase.User{
    return this.fbAuthService.getCurrentUser();
  }

  public processSavePerformanceToServer(id: string, localSavedTime: number, questions: QuestionResult[]) {
    this.fbDatabaseService.processSavePerformanceToServer(id, localSavedTime, questions);
  }

  public processRetrievePerformanceFromServer(id: string, localSavedTime: number, mergeData: (questions: QuestionResult[]) => any){
    this.fbDatabaseService.processRetrievePerformanceFromServer(id, localSavedTime, mergeData);
  }

  public deleteSavedPerformanceFromServer(id: string){
    this.fbDatabaseService.deleteSavedPerformanceFromServer(id);
  }
}
