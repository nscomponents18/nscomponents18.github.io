import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { NSBaseComponent } from "../ns-base";
import { INSEditorSetting } from "./interfaces";

declare var NSEditor: any;

export interface INSEditorAngularSetting extends INSEditorSetting {
    setting?: INSEditorSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-editor-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsEditor.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})
export class NSEditorAngular extends NSBaseComponent<typeof NSEditor> implements OnInit, OnChanges, AfterViewInit {
    @Input() setting!: INSEditorAngularSetting;
    @Input() containerStyle: any = {};

    @Output() maximized: EventEmitter<any> = new EventEmitter();
    @Output() restored: EventEmitter<any> = new EventEmitter();


    constructor() {
        super();
        this.initializeScripts(['NSEditor']);
    }

    ngOnInit(): void {
        if (!this.objNSComp) {
            this.initializeEvents([
                NSEditor.EVENT_MAXIMIZED,
                NSEditor.EVENT_RESTORED,
            ]);
            this.create();
            this.hasInitialized = true;
        }
    }

    ngAfterViewInit(): void { }

    ngOnChanges(changes: SimpleChanges): void { }

    create(): void {
        const container = this.element;
        this.objNSComp = new NSEditor(container, this.setting);
        this.hasInitialized = true;
    }

    toggleLineNumber(): void {
        this.objNSComp.toggleLineNumber();
    }

    setDisabled(isDisabled: boolean): void {
        this.objNSComp.setDisabled(isDisabled);
    }

    getDisabled(): boolean {
        return this.objNSComp.getDisabled();
    }

    setText(text: string): void {
        this.objNSComp.setText(text);
    }

    getText(): string {
        return this.objNSComp.getText();
    }

    setHtml(html: string): void {
        this.objNSComp.setHtml(html);
    }

    getHtml(): string {
        return this.objNSComp.getHtml();
    }

    setStyle(styleProp: string, value: any): void {
        this.objNSComp.setStyle(styleProp, value);
    }

    setFocus(isFocus: boolean): void {
        this.objNSComp.setFocus(isFocus);
    }

    hasFocus(): boolean {
        return this.objNSComp.hasFocus();
    }

    setTheme(theme: string): void {
        this.objNSComp.setTheme(theme);
    }

    changeProperty(propertyName: string, value: any): void {
        this.objNSComp.changeProperty(propertyName, value);
    }

    getNSEditor(): any {
        return this.objNSComp;
    }
}
