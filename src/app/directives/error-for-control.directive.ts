import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ErrorMessageGetter, ErrorToMessageMap } from '../errors/form-error.utils';

@Directive({
  selector: 'mat-error[appErrorForControl]',
  standalone: true
})
export class ErrorForControlDirective implements OnInit, OnDestroy {
  constructor(private el: ElementRef) {}

  @Input({required: true})
  appErrorForControl!: AbstractControl;

  @Input() set messages(value: [string, ErrorMessageGetter][]) {
    this.customMessages = new Map<string, ErrorMessageGetter>(value);
  }

  private customMessages!: Map<string, ErrorMessageGetter>;
  subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.appErrorForControl.statusChanges.subscribe(() => {
      const message = this.getMessage();
      this.el.nativeElement.innerHTML = message ?? '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const errorState = this.error.isErrorState(this.appErrorForControl, null);
  //   console.log(errorState);
  //   if (errorState) {
  //     const embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  //     const matErrorRef = embeddedViewRef.rootNodes[0];
  //     matErrorRef.innerHTML = this.getMessage();
  //
  //     console.log(matErrorRef);
  //   } else {
  //     this.viewContainer.clear();
  //   }
  // }

  private static defaultMessageGetter: ErrorMessageGetter = () => 'Field is invalid';

  getMessage(): string | undefined {
    if (!this.appErrorForControl.errors) {
      return undefined;
    }

    const error: [string, any] = Object.entries(this.appErrorForControl.errors)[0];
    const handler = this.customMessages?.get(error[0])
      ?? ErrorToMessageMap.get(error[0])
      ?? ErrorForControlDirective.defaultMessageGetter;

    return handler(error[1]);
  }
}
