/**
 * To convert number value to Time display
 */

import {Directive, ElementRef, Input} from "@angular/core";
@Directive({
  selector: '[gm-digital-time]'
})

export class DigitalTimeDirective{
  constructor(private el: ElementRef) {}

  @Input() set time(time : number){
    this.el.nativeElement.innerText = DigitalTimeDirective.convertTimeToString(time);
  }

  public static convertTimeToString(time : number) : string{
    let sign = time >= 0 ? '' : '- ';
    time = Math.abs(time);
    let minute = Math.floor(time / 60);
    let second = time % 60;
    return sign + DigitalTimeDirective.padLeft2Number(minute) +":"+DigitalTimeDirective.padLeft2Number(second);
  }

  private static padLeft2Number(n : number) : string{
    let pad = "00";
    let str = "" + n;
    return pad.substring(0, pad.length - str.length) + str;
  }
}
