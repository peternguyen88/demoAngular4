import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {Observable} from "rxjs/Observable";
import * as firebase from "firebase/app";

@Injectable()
export class FirebaseService{

  userDatabaseRef: firebase.User;

  constructor(private db: AngularFireDatabase, private fireAuth: AngularFireAuth){
    this.fireAuth.auth.onAuthStateChanged(function (user: firebase.User) {
      if(user){
        this.userDatabaseRef = db.database.ref('users').child(user.email);
      }else{
        this.userDatabaseRef = null;
      }
    });
  }

  public getUserObservable():Observable<firebase.User>{
    return this.fireAuth.authState;
  }

  public getCurrentUser():firebase.User{
    return this.fireAuth.auth.currentUser;
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
