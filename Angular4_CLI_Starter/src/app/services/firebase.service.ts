import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class FirebaseService{
  constructor(db: AngularFireDatabase, auth: AngularFireAuth){

  }
}
