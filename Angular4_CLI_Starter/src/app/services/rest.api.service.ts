import {Injectable} from "@angular/core";
import * as firebase from "firebase/app";
import {RestUser} from "../models/rest.model";
import {Http} from "@angular/http";
import {RestAPIConstants} from "./RestAPIConstants";


@Injectable()
export class RestAPIService{
  user: RestUser;

  constructor(private http: Http){}

  public onAuthenticationStateChanged(user: firebase.User){
    if(user){
      this.user = new RestUser();
      this.user.firebase_uid = user.uid;
      this.user.provider_id = user.providerData[0].providerId;
      this.user.provider_uid = user.providerData[0].uid;
      this.user.email = user.email;
      this.user.name = user.displayName;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(RestAPIConstants.LOGIN, JSON.stringify(this.user), headers).map(data => data.json()).subscribe(res => console.log(res));
    }else{
      this.user = null;
    }
  }
}
