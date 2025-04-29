import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ScriptLoaderService } from '../../script-loader.service';
import { NSBaseComponent } from '../ns-base';
import { INSMultiSelectDropdownSetting } from './interfaces';

declare var NSMultiSelectDropdown: any;

export interface INSMultiSelectDropdownAngularSetting extends INSMultiSelectDropdownSetting {
    setting?: INSMultiSelectDropdownSetting;
    dataSource?: any[];
    [propName: string]: any;
}

@Component({
    selector: 'ns-multiselect-dropdown-angular',
    template: '',
    standalone: false,
    styles: [
        `
        @import "../../../generated/css/nsMultiSelectDropdown.min.css";
      `
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NSMultiSelectDropdownAngular),
            multi: true
        }
    ]
})
export class NSMultiSelectDropdownAngular extends NSBaseComponent<typeof NSMultiSelectDropdown> implements OnInit, AfterViewInit, ControlValueAccessor {

    public static checkComponentLoaded(): void {
        if (!NSMultiSelectDropdown) {
            throw new Error('NSMultiSelectDropdown is not loaded yet.');
        }
    }

    public static get LABEL_TYPE_OF_TEXT(): any {
        this.checkComponentLoaded();
        return NSMultiSelectDropdown?.LABEL_TYPE_OF_TEXT;
    }

    public static get LABEL_TYPE_HORIZONTAL_LIST(): any {
        this.checkComponentLoaded();
        return NSMultiSelectDropdown?.LABEL_TYPE_HORIZONTAL_LIST;
    }

    public static get LABEL_TYPE_VERTICAL_LIST(): any {
        this.checkComponentLoaded();
        return NSMultiSelectDropdown?.LABEL_TYPE_VERTICAL_LIST;
    }

    @Input() setting: INSMultiSelectDropdownAngularSetting | undefined | null;
    @Input() set dataSource(arrSource: any[]) {
        this.__source = arrSource;
        if (this.objNSComp) {
            this.objNSComp.dataSource(this.__source);
        }
    }
    get dataSource(): any[] | null | undefined {
        return this.__source;
    }

    @Output() dropdownOpen: EventEmitter<any> = new EventEmitter();
    @Output() dropdownClose: EventEmitter<any> = new EventEmitter();
    @Output() dropdownItemClick: EventEmitter<any> = new EventEmitter();

    private __source: any[] | undefined | null;
    private __arrItems: any[] = [];
    private __arrValues: any[] = [];
    private onChange: (value: any) => void = () => { };
    private onTouched: () => void = () => { };

    constructor() {
        super();
        this.initializeScripts(['NSMultiSelectDropdown']);
    }

    ngOnInit(): void {
        if (!this.objNSComp) {
            this.initializeEvents([
                NSMultiSelectDropdown.DROPDOWN_OPEN,
                NSMultiSelectDropdown.DROPDOWN_CLOSE,
                NSMultiSelectDropdown.DROPDOWN_ITEM_CLICK
            ]);
            this.create();
        }
        this.hasInitialized = true;
    }

    ngAfterViewInit(): void {
        // Additional initialization logic if needed
    }

    create(): void {
        if (!this.objNSComp && this.setting) {
            if (this.__source && this.__source.length > 0) {
                this.setting.dataSource = this.__source;
            }
            this.objNSComp = new NSMultiSelectDropdown(this.element, this.setting);
            this.hasInitialized = true;

            // Handle any items to be selected/unselected
            if (this.__arrItems) {
                for (const item of this.__arrItems) {
                    this.setSelectUnselectItems(item.items, item.isSelected);
                }
            }
            if (this.__arrValues) {
                for (const value of this.__arrValues) {
                    this.setSelectUnselectItemsByValue(value.values, value.isSelected);
                }
            }
            this.hasInitialized = true;
        }
    }

    // ControlValueAccessor methods
    writeValue(value: any): void {
        if (value !== undefined && this.objNSComp) {
            this.objNSComp.setSelectUnselectItems(value, true);
        }
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (this.objNSComp) {
            //this.objNSComp.setDisabledState(isDisabled);
        }
    }

    getSelectedIndexes(): number[] {
        return this.objNSComp?.getSelectedIndexes();
    }

    getSelectedItems(): any[] {
        return this.objNSComp?.getSelectedItems();
    }

    setSelectUnselectItemsByValue(value: string | number, isSelected: boolean): void {
        if (this.objNSComp) {
            this.objNSComp.setSelectUnselectItemsByValue(value, isSelected);
        } else {
            this.__arrValues.push({ values: value, isSelected: isSelected });
        }
    }

    setSelectUnselectItems(arrItems: any, isSelected: boolean): void {
        if (this.objNSComp) {
            this.objNSComp.setSelectUnselectItems(arrItems, isSelected);
        } else {
            this.__arrItems.push({ items: arrItems, isSelected: isSelected });
        }
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

    protected override eventListener(event: any, eventName: string): void {
        switch (eventName) {
            case NSMultiSelectDropdown.DROPDOWN_OPEN:
                this.dropdownOpen.emit(event);
                break;
            case NSMultiSelectDropdown.DROPDOWN_CLOSE:
                this.dropdownClose.emit(event);
                break;
            case NSMultiSelectDropdown.DROPDOWN_ITEM_CLICK:
                this.dropdownItemClick.emit(event);
                break;
        }
    }
}
