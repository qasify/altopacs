import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputFieldComponent),
    multi: true
  }]
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() formControl?: FormControl ; // Made optional
  @Input() error?: string='' ; // Made optional

  private internalControl = new FormControl(''); // Internal control if formControl is not provided

  private onTouched: () => void = () => {};
  private onChange: (value: any) => void = () => {};

  get control() {
    return this.formControl || this.internalControl;
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.control.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    // this.onChange = fn;
    // this.control.valueChanges.subscribe(() => this.clearErrors())
  }

  registerOnTouched(fn: any): void {
    // this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }


  clearErrors(): void {
    // console.log("changing")
    this.error = ''
  }
}
