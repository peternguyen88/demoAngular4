export class FirebaseUser{
  email: string;
  uid: string;
  name: string;
  login_count: number;
  last_login: string;
  unlock_feature: boolean;
  disable: boolean;
  firebase_uid: string;

  constructor(email: string, name:string, uid:string){
    this.email = email;
    this.name = name;
    this.uid = uid;
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

export class UserQuestionReport{
  question_set: string;
  question_number: string;
  report_content: string;
  report_time: string;
  report_user_name: string;
  report_user_id: string;
  processed: boolean = false;
}
