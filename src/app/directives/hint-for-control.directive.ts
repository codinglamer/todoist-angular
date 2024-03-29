import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'mat-hint[appHintForControl]',
  standalone: true
})
export class HintForControlDirective implements OnInit, OnDestroy {
  constructor(private el: ElementRef) {}

  @Input({required: true})
  appHintForControl!: AbstractControl;

  @Input() defaultMessage: string | undefined;
  @Input() successMessage: string | undefined;

  subscription!: Subscription;

  ngOnInit(): void {
    if (!this.defaultMessage && !this.successMessage) {
      throw new Error(`${HintForControlDirective.name} must have at least one message`);
    }

    const matHintRef = this.el.nativeElement;
    matHintRef.innerHTML = this.defaultMessage ?? '';

    this.subscription = this.appHintForControl.statusChanges.subscribe(() => {
      const isValidState = this.appHintForControl.valid && this.appHintForControl.value;
      const message = isValidState
        ? this.successMessage
        : this.defaultMessage;

      if (isValidState) {
        matHintRef.classList.add('success');
      } else {
        matHintRef.classList.remove('success');
      }
      matHintRef.innerHTML = message ?? '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('CHANGE', this.appHintForControl);
  //   this.viewContainer.clear();
  // if (this.appHintForControlSuccessMessage
  //   && this.appHintForControl.valid && this.appHintForControl.value) {
  //   const matHintRef = this.createEmbeddedViewAndGetFirstElement();
  //   matHintRef.classList.add('success');
  //   matHintRef.innerHTML = this.appHintForControlSuccessMessage;
  //   console.log(matHintRef);
  // } else if (this.appHintForControlDefaultMessage && !this.appHintForControl.errors) {
  //   const matHintRef = this.createEmbeddedViewAndGetFirstElement();
  //   matHintRef.innerHTML = this.appHintForControlDefaultMessage;
  //   console.log(matHintRef);
  // }
  // if (this.appHintForControlDefaultMessage && !this.appHintForControl.dirty) {
  //   const matHintRef = this.createEmbeddedViewAndGetFirstElement();
  //   matHintRef.innerHTML = this.appHintForControlDefaultMessage;
  //   console.log(matHintRef);
  // }
  // }

  // private createEmbeddedViewAndGetFirstElement() {
  //   const embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  //   return embeddedViewRef.rootNodes[0];
  // }
}
