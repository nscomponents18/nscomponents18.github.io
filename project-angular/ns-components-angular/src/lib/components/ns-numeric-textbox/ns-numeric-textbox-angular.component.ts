import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { INSNumericTextBoxSetting } from './interfaces';
import { NSBaseComponent } from '../ns-base';

declare var NSNumericTextBox: any;

export interface INSNumericTextBoxAngularSetting extends INSNumericTextBoxSetting {
  setting?: INSNumericTextBoxSetting;
  [propName: string]: any;
}

@Component({
  selector: 'ns-numeric-textbox-angular',
  template: `<input type="text" [disabled]="disabled" #txtRef>`,
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NSNumericTextBoxAngular),
      multi: true
    },
  ],
  styles: [`
    @import "../../../generated/css/nsNumericTextBox.min.css";
`],
  encapsulation: ViewEncapsulation.None
})
export class NSNumericTextBoxAngular extends NSBaseComponent<typeof NSNumericTextBox> implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() set setting(value: INSNumericTextBoxAngularSetting | null | undefined) {
    this.__setting = value;
    if(value && this.__input) {
      value.input = this.__input.nativeElement;
      this.objNSComp = new NSNumericTextBox(value);
      this.hasInitialized = true;
    }
  }
  get setting(): INSNumericTextBoxAngularSetting | null | undefined {
      return this.__setting;
  }

  @ViewChild('txtRef', { static: false }) private __input!: ElementRef;

  @Input() disabled: boolean = false;
  @Input() __setting: INSNumericTextBoxAngularSetting | undefined | null;

  @Output() modelChanged = new EventEmitter<any>();
  @Output() formatValueChanged = new EventEmitter<any>();
  @Output() spin = new EventEmitter<any>();
  @Output() valueChanged = new EventEmitter<any>();

  private __onChange!: (value: any) => void;
  private __onTouch!: () => void;
  private __pendingValue: any | undefined;

  constructor() {
    super();
    this.initializeScripts(['NSNumericTextBox']);
  }

  ngOnInit(): void {
    this.initializeEvents([NSNumericTextBox.SPIN,
      NSNumericTextBox.VALUE_CHANGED
    ]);
  }

  ngAfterViewInit(): void {
    if(this.setting && this.__input && !this.objNSComp) {
      const setting = this.setting;
      setting.input = this.__input.nativeElement;
      this.objNSComp = new NSNumericTextBox(setting);
      if (this.__pendingValue !== undefined) {
        this.setValue(this.__pendingValue, false);
        this.__pendingValue = undefined;
      }
      this.hasInitialized = true;
    }
  }

  writeValue(value: any): void {
    if (this.objNSComp) {
      this.setValue(value, false);
    } else {
      this.__pendingValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.__onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.__onTouch = fn;
  }

  getTextBox(): ElementRef {
    return this.__input;
  }

  setValue(text: any, fireEvent: boolean): void {
    this.objNSComp.setValue(text, fireEvent);
  }

  getValue(): number {
    return this.objNSComp.getValue();
  }

  getFormattedValue(): string {
    return this.objNSComp.getFormattedValue();
  }

  setTheme(theme: string): void {
    this.objNSComp.setTheme(theme);
  }

  protected override eventListener(event: any,eventName: string): void {
    if (event.type === NSNumericTextBox.VALUE_CHANGED) {
      const newValue = event.detail.newValue;
      if (this.__onChange) {
        this.__onChange(newValue);
        this.__onTouch();
        this.modelChanged.emit(newValue);
        this.formatValueChanged.emit(this.getFormattedValue());
      }
    }
    super.eventListener(event, eventName);
  }
}  