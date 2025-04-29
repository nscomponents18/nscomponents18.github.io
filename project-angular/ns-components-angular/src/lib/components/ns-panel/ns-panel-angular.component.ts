import { Component, ViewEncapsulation, OnChanges, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, SimpleChange } from "@angular/core";
import { INSPanelSetting } from "./interfaces";
import { NSBaseComponent } from "../ns-base";


declare var NSPanel: any;

export interface INSPanelAngularSettings extends INSPanelSetting {
    setting?: INSPanelSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-panel-angular',
    template: '<ng-content></ng-content>',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsPanel.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})

export class NSPanelAngular extends NSBaseComponent<typeof NSPanel> implements OnChanges, OnInit, AfterViewInit {
    @Input() setting!: INSPanelAngularSettings;

    @Output() dragStaring: EventEmitter<any> = new EventEmitter();
    @Output() dragging: EventEmitter<any> = new EventEmitter();
    @Output() dragEnd: EventEmitter<any> = new EventEmitter();
    @Output() resizeStaring: EventEmitter<any> = new EventEmitter();
    @Output() resizing: EventEmitter<any> = new EventEmitter();
    @Output() resizeEnd: EventEmitter<any> = new EventEmitter();
    @Output() collapseStarting: EventEmitter<any> = new EventEmitter();
    @Output() collapseEnd: EventEmitter<any> = new EventEmitter();
    @Output() expansionStarting: EventEmitter<any> = new EventEmitter();
    @Output() expansionEnd: EventEmitter<any> = new EventEmitter();
    @Output() minimizeStarting: EventEmitter<any> = new EventEmitter();
    @Output() minimizeEnd: EventEmitter<any> = new EventEmitter();
    @Output() maximizeStarting: EventEmitter<any> = new EventEmitter();
    @Output() maximizeEnd: EventEmitter<any> = new EventEmitter();
    @Output() fullScreenStarting: EventEmitter<any> = new EventEmitter();
    @Output() fullScreenEnd: EventEmitter<any> = new EventEmitter();
    @Output() restoreStarting: EventEmitter<any> = new EventEmitter();
    @Output() restoreEnd: EventEmitter<any> = new EventEmitter();
    @Output() closed: EventEmitter<any> = new EventEmitter();


    constructor() {
        super();
        this.initializeScripts(['NSPanel']);
    };

    ngOnInit(): void {
    };

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    };

    //elements children are created in ngAfterViewInit and not in ngOnInit
    ngAfterViewInit(): void {
        this.create();
    };

    open(): void {
        /*if(!this.objNSComp)
        {
            this.element = this.elementRef.nativeElement;
            this.objNSComp = new NSPanel(this.element,this.setting); 
            this.__creationHandler();
            this.__addEventHandlers();
        }*/
        if (this.objNSComp) {
            return this.objNSComp.open();
        }
    };

    close(): void {
        if (this.objNSComp) {
            return this.objNSComp.close();
        }
    };

    removeModal(): void {
        if (this.objNSComp) {
            return this.objNSComp.removeModal();
        }
    };

    getBaseElement(): any {
        if (this.objNSComp) {
            return this.objNSComp.getBaseElement();
        }
        return null;
    };

    minimize(): void {
        if (this.objNSComp) {
            this.objNSComp.minimize();
        }
    };

    maximize(): void {
        if (this.objNSComp) {
            this.objNSComp.maximize();
        }
    };

    collapse(): void {
        if (this.objNSComp) {
            this.objNSComp.collapse();
        }
    };

    expand(): void {
        if (this.objNSComp) {
            this.objNSComp.expand();
        }
    };

    fullScreen(): void {
        if (this.objNSComp) {
            this.objNSComp.fullScreen();
        }
    };

    restore(): void {
        if (this.objNSComp) {
            this.objNSComp.restore();
        }
    };

    disableResize(): void {
        if (this.objNSComp) {
            this.objNSComp.disableResize();
        }
    };

    disableDrag(): void {
        if (this.objNSComp) {
            this.objNSComp.disableDrag();
        }
    };

    disableCollapse(): void {
        if (this.objNSComp) {
            this.objNSComp.disableCollapse();
        }
    };

    disableMinMax(): void {
        if (this.objNSComp) {
            this.objNSComp.disableCollapse();
        }
    };

    disableFullScreen(): void {
        if (this.objNSComp) {
            this.objNSComp.disableCollapse();
        }
    };

    isCollapsed(): boolean {
        if (this.objNSComp) {
            return this.objNSComp.isCollapsed();
        }
        return false;
    };

    isMinimized(): boolean {
        if (this.objNSComp) {
            return this.objNSComp.isMinimized();
        }
        return false;
    };

    isFullScreen(): boolean {
        if (this.objNSComp) {
            return this.objNSComp.isFullScreen();
        }
        return false;
    };

    private create(): void {
        if (!this.objNSComp) {
            this.objNSComp = new NSPanel(this.element, this.setting);
            if (!this.element) {
                this.element = this.objNSComp.getBaseElement();
                this.initializeEvents([NSPanel.DRAG_STARTING,
                NSPanel.DRAGGING,
                NSPanel.DRAG_END,
                NSPanel.RESIZE_STARTING,
                NSPanel.RESIZING,
                NSPanel.RESIZE_END,
                NSPanel.COLLAPSE_STARTING,
                NSPanel.COLLAPSE_END,
                NSPanel.EXPANSION_STARTING,
                NSPanel.EXPANSION_END,
                NSPanel.MINIMIZE_STARTING,
                NSPanel.MINIMIZE_END,
                NSPanel.FULLSCREEN_STARTING,
                NSPanel.FULLSCREEN_END,
                NSPanel.RESTORE_STARTING,
                NSPanel.RESTORE_END,
                NSPanel.CLOSED
                ]);
            }
            this.hasInitialized = true;
        }
    };
}