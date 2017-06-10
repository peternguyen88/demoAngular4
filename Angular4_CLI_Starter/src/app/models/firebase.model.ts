export class FirebaseUser{
  email: string;
  name: string;
  login_count: number;
  last_login: string;
  unlock_feature: boolean;
  disable: boolean;

  constructor(email: string, name:string){
    this.email = email;
    this.name = name;
    this.login_count = 0;
    this.disable = false;
    this.unlock_feature = false;
  }
}

export class FirebasePerformanceSummary{
  id: string;
  total_questions: number = 0;
  answered_questions: number = 0;
  correct_questions: number = 0;
  total_time: number = 0;
  last_saved: string;
  last_saved_time: number;
}
