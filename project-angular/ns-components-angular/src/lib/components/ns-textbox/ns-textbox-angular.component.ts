import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { NSBaseComponent } from "../ns-base";
import { INSTextBoxSetting } from "./interfaces";

import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation } from "@angular/core";

declare var NSTextBox: any;

export interface INSTextBoxAngularSetting extends INSTextBoxSetting {
    setting?: INSTextBoxSetting;
    containerStyle?: any;
    [propName: string]: any;
}

@Component({
    selector: 'ns-text-box-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsTextBox.min.css";
        @import "../../../generated/css/nsGrid.min.css";
        @import "../../../generated/css/nsList.min.css";
    `],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => NSTextBoxAngular),
          multi: true
        },
    ],
})

export class NSTextBoxAngular extends NSBaseComponent<typeof NSTextBox> implements OnChanges, OnInit, AfterViewInit {
    @Input() setting: INSTextBoxAngularSetting | null | undefined;
    @Input() set dataSource(arrSource: any[]) {
        this.__dataSource = arrSource;
        if (this.objNSComp) {
            this.objNSComp.dataSource(arrSource);
        }
    }
    get dataSource(): any[] {
        return this.__dataSource;
    }

    @Output() itemSelected: EventEmitter<any> = new EventEmitter();
    @Output() itemUnselected: EventEmitter<any> = new EventEmitter();

    public static checkComponentLoaded(): void {
        if (!NSTextBox) {
            throw new Error('NSTextBox is not loaded yet.');
        }
    }

    public static get TYPE_AUTOTEXT(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_AUTOTEXT;
    }

    public static get TYPE_AUTOCOMPLETE(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_AUTOCOMPLETE;
    }

    public static get TYPE_EMAIL(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_EMAIL;
    }

    public static get TYPE_NUMBER(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_NUMBER;
    }

    public static get TYPE_PASSWORD(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_PASSWORD;
    }

    public static get TYPE_URL(): any {
        this.checkComponentLoaded();
        return NSTextBox?.TYPE_URL;
    }

    public static get DROPDOWN_TYPE_LIST(): any {
        this.checkComponentLoaded();
        return NSTextBox?.DROPDOWN_TYPE_LIST;
    }

    public static get DROPDOWN_TYPE_GRID(): any {
        this.checkComponentLoaded();
        return NSTextBox?.DROPDOWN_TYPE_GRID;
    }

    /*public static readonly TYPE_AUTOTEXT = NSTextBox.TYPE_AUTOTEXT;
    public static readonly TYPE_AUTOCOMPLETE = NSTextBox.TYPE_AUTOCOMPLETE;
    public static readonly TYPE_EMAIL = NSTextBox.TYPE_EMAIL;
    public static readonly TYPE_NUMBER = NSTextBox.TYPE_NUMBER;
    public static readonly TYPE_PASSWORD = NSTextBox.TYPE_PASSWORD;
    public static readonly TYPE_URL = NSTextBox.TYPE_URL;
    public static readonly DROPDOWN_TYPE_LIST = NSTextBox.DROPDOWN_TYPE_LIST;
    public static readonly DROPDOWN_TYPE_GRID = NSTextBox.DROPDOWN_TYPE_GRID;*/
    public static readonly FILTER_TYPE_EXACT = "exact";
    public static readonly FILTER_TYPE_STARTS_WITH = "startsWith";
    public static readonly FILTER_TYPE_ENDS_WITH = "endsWith";
    public static readonly FILTER_TYPE_CONTAINS = "contains";

    private __dataSource!: any[];

    constructor() {
        super();
        this.initializeScripts(['NSGrid', 'NSTextBox']);
    };

    ngOnInit(): void {
        this.initializeEvents([NSTextBox.ITEM_SELECTED,
        NSTextBox.ITEM_UNSELECTED]);
        /*let util = new NSUtil();
        let eventHandler:any = this.__eventHandler.bind(this);
        util.addEvent(this.__element,NSTextBox.ITEM_SELECTED,eventHandler);
        util.addEvent(this.__element,NSTextBox.ITEM_UNSELECTED,eventHandler);*/
       
    };

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (!this.objNSComp && this.setting) {
            if (this.__dataSource) {
                this.setting["dataSource"] = this.__dataSource;
            }
            this.create();
        }
    };

    ngAfterViewInit(): void {
    };

    create(): void {
        if(this.setting) {
            this.objNSComp = new NSTextBox(this.element, this.setting);
            this.hasInitialized = true;
        }
    };

    getTextBox(): any {
        return this.objNSComp.getTextBox();
    };

    setText(text: string): void {
        this.objNSComp.setText(text);
    };

    getText(): string {
        return this.objNSComp.getText();
    };

    setSelectedItems(arrItems: any[]): void
    {
        this.objNSComp.setSelectedItems(arrItems);
    };
    
    setSelectedItem(item: any): void
    {
        this.objNSComp.setSelectedItem(item);
    };
    
    setSelectedIndexes(arrSelectedIndex: number[]): void
    {
        this.objNSComp.setSelectedIndexes(arrSelectedIndex);
    };
    
    setSelectedIndex(selectedIndex: number): void
    {
        this.objNSComp.setSelectedIndexes(selectedIndex);
    };
    
    unSelectItems(arrItems: any[]): void
    {
        this.objNSComp.unSelectItems(arrItems);
    };
    
    unSelectItem(item: any): void
    {
        this.objNSComp.unSelectItem(item);
    };
    
    unSelectIndexes(arrSelectedIndex: number[]): void
    {
        this.objNSComp.unSelectIndexes(arrSelectedIndex);
    };
    
    unSelectIndex(selectedIndex: number): void
    {
        this.objNSComp.unSelectIndex(selectedIndex);
    };
    
    unSelectAll(fireEvent?: boolean): void
    {
        this.objNSComp.unSelectAll(fireEvent);
    };

    getSelectedItem(): any {
        return this.objNSComp.getSelectedItem();
    };

    getSelectedItems(): any[] {
        return this.objNSComp.getSelectedItems();
    };
}