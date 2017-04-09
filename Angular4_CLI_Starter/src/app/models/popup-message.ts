/**
 * Created by Peter on 4/9/2017.
 */
export class PopupMessage {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  static ANSWER_REQUIRED: PopupMessage = new PopupMessage("Answer Required!", "You cannot continue with this question unanswered.");
  static CONFIRM_NEXT_QUESTION: PopupMessage = new PopupMessage("Answer Confirmation!", "Click Confirm to confirm your answer and continue to the next question.");
  static TEST_PAUSED: PopupMessage = new PopupMessage("You Have Paused The Test!", "Please click Resume to continue the test.");
  static TIME_OUT: PopupMessage = new PopupMessage("Timeout!", "Test time has run out. Please click Continue to continue the Test in Practice Mode.");

  public isConfirmation(): boolean {
    return this == PopupMessage.CONFIRM_NEXT_QUESTION;
  }

  public isPaused(): boolean{
    return this == PopupMessage.TEST_PAUSED;
  }

  public isTimeout(): boolean{
    return this == PopupMessage.TIME_OUT;
  }
}
