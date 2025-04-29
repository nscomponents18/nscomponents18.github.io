import { Component, ViewEncapsulation, OnChanges, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, SimpleChange } from "@angular/core";
import { INSCalendarSetting } from "./interfaces";
import { NSBaseComponent } from "../ns-base";


declare var NSCalendar: any;

export interface INSCalendarAngularSetting extends INSCalendarSetting {
    setting?: INSCalendarSetting;
    [propName: string]: any;
}


@Component({
    selector: 'ns-calendar-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsComponent.min.css";
        @import "../../../generated/css/nsCalendar.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})
export class NSCalendarAngular extends NSBaseComponent<typeof NSCalendar> implements OnChanges, OnInit, AfterViewInit {
    @Input() setting!: INSCalendarAngularSetting;

    @Output() dateSelected: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
        this.initializeScripts(['NSCalendar']);
    };

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {

    };

    ngOnInit(): void {
        this.objNSComp = new NSCalendar(this.element, this.setting);
        this.initializeEvents([NSCalendar.DATE_SELECTED]);
        this.hasInitialized = true;
    };

    ngAfterViewInit(): void {
    };

    getSelectedDate(): any {
        return this.objNSComp.getSelectedDate();
    };

    getSelectedDateAsString(format: string): any {
        return this.objNSComp.getSelectedDateAsString(format);
    };

    setSelectedDate(date: any, format: string): void {
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
}  