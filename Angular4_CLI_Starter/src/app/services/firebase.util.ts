import {QuestionResult} from "../models/test-result";
export class FirebaseUtil{
  public static userPath(email: string){
    return "users/" + FirebaseUtil.cleanEmail(email);
  }

  public static performancePath(email: string, setID : string){
    return "performances/" + FirebaseUtil.cleanEmail(email) + "/" + setID;
  }

  public static performancePathSummary(email: string, setID : string){
    return "performances/" + FirebaseUtil.cleanEmail(email) + "/" + setID + "/summary";
  }

  public static performancePathLastSavedTime(email: string, setID : string){
    return "performances/" + FirebaseUtil.cleanEmail(email) + "/" + setID + "/summary/last_saved_time";
  }

  public static performancePathDetail(email: string, setID : string){
    return "performances/" + FirebaseUtil.cleanEmail(email) + "/" + setID + "/detail";
  }

  static cleanEmail(email:string):string{
    return email ? email.replace(/\./g, '_') : email;
  }

  // This method doesn't work on deep object.
  // If need deep object try this: https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  static removeUndefined(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  static cleanQuestionResultForSaving(questionResult: QuestionResult){
    if(!questionResult.selected_answer){
      questionResult.bookmarked = null;
      questionResult.remarks = null;
      questionResult.question_time = null;
      questionResult.is_correct = null;
    } else {
      if(!questionResult.bookmarked) questionResult.bookmarked = null;
      if(!questionResult.remarks || questionResult.remarks.length == 0) questionResult.remarks = null;
    }
    FirebaseUtil.removeUndefined(questionResult);
  }
}
