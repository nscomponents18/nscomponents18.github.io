import { Component, ViewEncapsulation, OnChanges, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, SimpleChange, forwardRef } from "@angular/core";
import { NSBaseComponent } from "../ns-base";
import { INSDatePickerSetting } from "./interfaces";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";


declare var NSCalendar: any;
declare var NSDatePicker: any;

export interface INSDatePickerAngularSetting extends INSDatePickerSetting {
    setting?: INSDatePickerSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-date-picker-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsComponent.min.css";
        @import "../../../generated/css/nsDatePicker.min.css";
    `],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NSDatePickerAngular),
            multi: true
        }
    ]
})

export class NSDatePickerAngular extends NSBaseComponent<typeof NSDatePicker> implements OnChanges, OnInit, AfterViewInit, ControlValueAccessor {
    @Input() setting!: INSDatePickerAngularSetting;

    @Output() nsCalendarOpened: EventEmitter<any> = new EventEmitter();
    @Output() nsCalendarClosed: EventEmitter<any> = new EventEmitter();
    @Output() nsDateSelected: EventEmitter<any> = new EventEmitter();
    @Output() nsInputChange: EventEmitter<any> = new EventEmitter();
    @Output() modelChanged = new EventEmitter();

    private __onChange!: (value: any) => void;
    private __onTouch!: () => void;

    /*@Input()
    get model(): any {
        return this.__modelValue;
    };

    set model(value: any) {
        if (!this.__isInternalCall) {
            this.__modelValue = value;
            if (this.objNSComp) {
                this.objNSComp.setSelectedDate(this.__modelValue, null, false);
            }
            this.onChange(this.__modelValue);
            this.modelChange.emit(this.__modelValue);
        }
        this.__isInternalCall = false;
    };*/

    //private __modelValue: any;
    private __isInternalCall: boolean = false;
    private __pendingValue: any | undefined;

    constructor() {
        super();
        this.initializeScripts(['NSDatePicker']);
    };

    writeValue(value: any): void {
        //this.__modelValue = value;
        if (this.objNSComp) {
            this.objNSComp.setSelectedDate(value, null, false);
            let dateFormat: string = this.setting.inputDateFormat || "MM/dd/yyyy";
            const textValue = this.getSelectedDateAsString(dateFormat);
            if(textValue !== this.getTextBox().value) {
                this.getTextBox().value = textValue;
            }
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

    setDisabledState?(isDisabled: boolean): void {
        // Implement disabled state logic if needed
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {

    };

    ngOnInit(): void {
        this.objNSComp = new NSDatePicker(this.element, this.setting);
        this.initializeEvents([NSDatePicker.CALENDAR_OPENED,
        NSDatePicker.CALENDAR_CLOSED,
        NSDatePicker.DATE_SELECTED,
        NSDatePicker.INPUT_CHANGE]);
        this.hasInitialized = true;
        //this.nsUtil.addEvent(this.element, NSDatePicker.DATE_SELECTED, this.__dateSelectedHandler.bind(this));
        //this.nsUtil.addEvent(this.element, NSDatePicker.INPUT_CHANGE, this.__inputChangeHandler.bind(this));
    };

    ngAfterViewInit(): void {
        if (this.__pendingValue !== undefined) {
            this.objNSComp.setSelectedDate(this.__pendingValue, null, false);
            this.__pendingValue = undefined;
        }
    };

    getSelectedDate(): any {
        return this.objNSComp.getSelectedDate();
    };

    getSelectedDateAsString(format: string): any {
        return this.objNSComp.getSelectedDateAsString(format);
    };

    setSelectedDate(date: any, format?: string): void {
        this.objNSComp.setSelectedDate(date, format);
    };

    setYear(year: number): void {
        this.objNSComp.setYear(year);
    };

    setMonth(month: number): void {
        this.objNSComp.setMonth(month);
    };

    reset(): void {
        this.objNSComp.reset();
    };

    setTodayDate(): void {
        this.objNSComp.setTodayDate();
    };

    showCalendar(isAbsolutePosition?: boolean): void {
        this.objNSComp.showCalendar(isAbsolutePosition);
    };

    closeCalendar(): void {
        this.objNSComp.closeCalendar();
    };

    getCalendar(): typeof NSCalendar {
        return this.objNSComp.getCalendar();
    };

    getTextBox(): HTMLInputElement {
        return this.objNSComp.getTextBox();
    };

    getText(): any {
        if (this.objNSComp) {
            return this.objNSComp.getText();
        }
        return "";
    };

    toggleCalendarVisibility(): void {
        this.objNSComp.toggleCalendarVisibility();
    };

    setStyle(styleProp: string, value: any): void {
        this.objNSComp.setStyle(styleProp, value);
    };

    setFocus(isFocus: boolean): void {
        this.objNSComp.setFocus(isFocus);
    };

    hasFocus(): boolean {
        return this.objNSComp.hasFocus();
    };

    setTheme(theme: string): void {
        this.objNSComp.setTheme(theme);
    };

    changeProperty(propertyName: string, value: any): void {
        this.objNSComp.changeProperty(propertyName, value);
    };

    private fireChangeEvents(newValue: any) {
        if (this.__onChange) {
            this.__onChange(newValue);
            this.__onTouch();
            this.modelChanged.emit(newValue);
        }
    }

    private __dateSelectedHandler(event: any) {
        this.__isInternalCall = true;
        //this.__modelValue = event.detail;
        this.fireChangeEvents(event.detail);
    }

    private __inputChangeHandler(event: any) {
        this.__isInternalCall = true;
        //this.__modelValue = event.detail;
        this.fireChangeEvents(event.detail);
    }

    protected override eventListener(event: any, eventName: string) {
        let type: any = event.type;
        if(type === NSDatePicker.DATE_SELECTED) {
            this.__dateSelectedHandler(event);
        }
        else if(type === NSDatePicker.INPUT_CHANGE) {
            this.__inputChangeHandler(event);
        }
        type = "ns" + type.charAt(0).toUpperCase() + type.slice(1);
        //@ts-ignore
        this[type].emit(event.detail);
    }
}