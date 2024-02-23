import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * Toggle renders a toggle/switch with a label text on the right to it.
 * Optionally a tooltip text can be provided.
 *
 * This is a FormControl and must be used as one.
 *
 * Usage:
 * <lib-toggle
 *     [labelText]="'Activate specific behaviour'"
 *     [formControl]="exampleControlName"
 *     [tooltipText]="'When activated, everything works!.'"
 * ></lib-toggle>
 *
 * Example FormControl setting:
 * exampleControlName: FormControl = new FormControl({
 *   value: 10, <--- value type is up to you, could be string etc.
 *   disabled: true, <--- here you can change the disable state
 * })
 */
@Component({
  standalone: true,
  selector: 'lib-toggle',
  templateUrl: './toggle.component.html',
  imports: [NgbTooltipModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => LibToggleComponent),
    },
  ],
})
export class LibToggleComponent implements ControlValueAccessor {
  /** Text that stands on the right, next to the switch. */
  @Input() labelText: string;

  /** Text that is presented in tooltip. Hover label text to activate the tooltip. */
  @Input() tooltipText?: string;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Disabling the input should only be done via FormControl.
   * There is no property you can bind to.
   *
   * Example for FormControl setting:
   * exampleControl: FormControl = new FormControl({
   *   value: 10,
   *   disabled: true, <--- here you can change the disable state
   * })
   *
   * or programmatically:
   * this.exampleControl.disable();
   * this.exampleControl.enable();
   */
  isDisabled: boolean;
  randomId: string = `lib-id-${(Math.random() + 1).toString(36).substring(7)}`;

  set value(val: boolean) {
    this._value = val;
  }
  get value(): boolean {
    return this._value;
  }
  private _value: boolean;

  constructor() {}

  // Allows Angular to update the model.
  writeValue(value: boolean): void {
    this.value = value;
  }
  // Allows Angular to register a function to call when the model (rating) changes.
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  // Allows Angular to register a function to call when the input has been touched.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // Allows Angular to disable the input.
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
