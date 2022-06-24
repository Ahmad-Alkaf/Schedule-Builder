import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    console.log('hi here is autofocus')
    this.host.nativeElement.focus();
  }
}
