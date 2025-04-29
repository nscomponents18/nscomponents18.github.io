import { ScriptLoaderService } from "../../script-loader.service";
import { NSBaseComponent } from "../ns-base";
import { INSTabNavigatorSetting } from "./interfaces";

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation } from "@angular/core";

declare var NSTabNavigator: any;

export interface INSTabNavigatorAngularSetting extends INSTabNavigatorSetting {
    setting?: INSTabNavigatorSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-tab-navigator-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsTabNavigator.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})

export class NSTabNavigatorAngular extends NSBaseComponent<typeof NSTabNavigator> implements OnChanges, OnInit, AfterViewInit {
    @Input() setting: INSTabNavigatorAngularSetting | null | undefined;

    @Output() tabChangeStarting: EventEmitter<any> = new EventEmitter();
    @Output() tabChanged: EventEmitter<any> = new EventEmitter();
    @Output() tabChangeEnd: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
        this.initializeScripts(['NSTabNavigator']);
    };

    ngOnInit(): void {
        this.initializeEvents([NSTabNavigator.TAB_CHANGE_STARTING,
            NSTabNavigator.TAB_CHANGED,
            NSTabNavigator.TAB_CHANGE_END]);
       
       this.create();
    };

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        
    };

    ngAfterViewInit(): void {
    };

    create(): void {
        if (!this.objNSComp && this.setting) {
            this.objNSComp = new NSTabNavigator(this.element, this.setting);
            this.hasInitialized = true;
        }
    };
}