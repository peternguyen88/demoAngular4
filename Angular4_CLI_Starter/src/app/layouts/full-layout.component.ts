import { Component, OnInit } from '@angular/core';
import {FirebaseDatabaseService} from "../services/firebase.database.service";
import {Observable} from "rxjs/Observable";
import * as firebase from "firebase/app";
import {WebService} from "../services/web-service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styles:['h4{font-family: "Comic Sans MS", cursive, sans-serif;}'],
  styleUrls:['../../assets/css/facebook-login.css']
})
export class FullLayoutComponent implements OnInit {

  user: firebase.User;

  constructor(private webService: WebService) {
    this.webService.subscribeOnAuthStateChanged(user => this.user = user);
  }

  public disabled:boolean = false;
  public status:{isopen:boolean} = {isopen: false};

  public toggleDropdown($event:MouseEvent):void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public login(){
    this.webService.login();
  }

  public logout(){
    this.webService.logout();
  }

  public isLogin():boolean{
    return this.webService.isLogin();
  }

  public getCurrentUser() : firebase.User{
    return this.webService.getCurrentUser();
  }

  ngOnInit(): void {}
}
