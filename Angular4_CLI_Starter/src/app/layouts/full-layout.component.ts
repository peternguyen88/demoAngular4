import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../services/firebase.service";
import {Observable} from "rxjs/Observable";
import * as firebase from "firebase/app";

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styles:['h4{font-family: "Comic Sans MS", cursive, sans-serif;}'],
  styleUrls:['../../assets/css/facebook-login.css']
})
export class FullLayoutComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(private fbService: FirebaseService) {
    this.user = fbService.getUserObservable();
  }

  public disabled:boolean = false;
  public status:{isopen:boolean} = {isopen: false};

  public toggled(open:boolean):void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event:MouseEvent):void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public login(){
    this.fbService.login();
  }

  public logout(){
    this.fbService.logout();
  }

  public isLogin():boolean{
    return this.fbService.isLogin();
  }

  public getCurrentUser() : firebase.User{
    return this.fbService.getCurrentUser();
  }

  ngOnInit(): void {}
}
