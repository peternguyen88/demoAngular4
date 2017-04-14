export interface ConfirmMessage {
  header: string;
  message: string;
  icon?: string;
  accept?: Function;
  reject?: Function;
  acceptLabel?: string;
  rejectLabel?: string;
  showCloseIcon?: boolean;
}

export class ConfirmMessageConstant {
  static ANSWER_REQUIRED: ConfirmMessage = {
    header: 'Answer Required!',
    message: 'You cannot continue with this question unanswered.',
    rejectLabel: 'Close',
    showCloseIcon: true
  };

  static CONFIRM_NEXT_QUESTION: ConfirmMessage = {
    header: 'Answer Confirmation!',
    message: 'Click Confirm to confirm your answer and continue to the next question.',
    acceptLabel: 'Confirm',
    rejectLabel: 'Close',
    showCloseIcon: true
  };

  static TEST_PAUSED: ConfirmMessage = {
    header: 'You Have Paused The Test!',
    message: 'Please click Resume to continue the test.',
    acceptLabel: 'Resume',
    showCloseIcon: false
  };

  static TIMEOUT: ConfirmMessage = {
    header: 'Timeout!',
    message: 'Test time has run out. Please click Continue to continue the Test in Practice Mode.',
    acceptLabel: 'Continue',
    rejectLabel: 'End Test',
    showCloseIcon: false
  };

  static CANNOT_SWITCH_TO_TEST_MODE: ConfirmMessage = {
    header: 'Cannot Switch To Test Mode!',
    message: 'Test time has run out. You cannot switch to Test Mode',
    acceptLabel: 'OK',
    showCloseIcon: true
  };

  static FINAL_QUESTION_REACHED: ConfirmMessage = {
    header: 'Final Question',
    message: 'Congratulation, you have reached the end of the test. Click Finish to end the test or Cancel to change your answer.',
    acceptLabel: 'Finish',
    rejectLabel: 'Cancel',
    showCloseIcon: true
  };
}
