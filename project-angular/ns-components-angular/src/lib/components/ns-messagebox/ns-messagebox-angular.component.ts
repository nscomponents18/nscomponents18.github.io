import { Component, ViewEncapsulation, OnChanges, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, SimpleChange, ViewContainerRef, ContentChildren, QueryList, ViewChild } from "@angular/core";
import { INSMessageBoxAlertSetting, INSMessageBoxCallbackFunction, INSMessageBoxConfirmSetting, INSMessageBoxCustomSetting, INSMessageBoxSetting, MessageBoxComponentRef } from "./interfaces";
import { NSBaseComponent } from "../ns-base";
import { NSDynamicComponentService } from "../../services";

declare var NSPanel: any;
declare var NSMessageBox: any;

export interface INSMessageBoxAngularSetting extends INSMessageBoxSetting {
    setting?: INSMessageBoxSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-message-box-angular',
    template: `<ng-template #dynamicContainer></ng-template>
               <ng-content></ng-content>`,
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsMessageBox.min.css";
    `],
    encapsulation: ViewEncapsulation.None,
    providers:[NSDynamicComponentService]
})

export class NSMessageBoxAngular extends NSBaseComponent<typeof NSMessageBox> implements OnChanges, OnInit, AfterViewInit {
    @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
    dynamicContainer!: ViewContainerRef;

    @ContentChildren(ElementRef, { descendants: true }) contentChildren!: QueryList<ElementRef>;

    @Input() setting!: INSMessageBoxAngularSetting | undefined | null;

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

    @Output() rendererComponentCreated:EventEmitter<any> = new EventEmitter();

    private __objNSPanel?: typeof NSPanel;
    private __objBodyContent: any;
    private __objCustomComponent: any;
    private __bodyComponentInstance: any;

    constructor(private dynamicComponentService: NSDynamicComponentService) {
        super();
        this.initializeScripts(['NSPanel', 'NSMessageBox']);
    };

    ngOnInit(): void {
        if (this.element) {
            this.__objBodyContent = this.element;
        }
        this.__createComponent();
    };

    ngAfterContentInit() {
        if (this.contentChildren.length === 0) {
            //const componentRef = this.dynamicContainer.createComponent();
            // Access component instance if needed
            // const instance = componentRef.instance;
        }
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    };

    //elements children are created in ngAfterViewInit and not in ngOnInit
    ngAfterViewInit(): void {
    };

    minimize(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.minimize();
        }
    };

    maximize(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.maximize();
        }
    };

    collapse(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.collapse();
        }
    };

    expand(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.expand();
        }
    };

    fullScreen(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.fullScreen();
        }
    };

    restore(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.restore();
        }
    };

    disableResize(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.disableResize();
        }
    };

    disableDrag(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.disableDrag();
        }
    };

    disableCollapse(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.disableCollapse();
        }
    };

    disableMinMax(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.disableCollapse();
        }
    };

    disableFullScreen(): void {
        if (this.__objNSPanel) {
            this.__objNSPanel.disableCollapse();
        }
    };

    isCollapsed(): boolean {
        if (this.__objNSPanel) {
            return this.__objNSPanel.isCollapsed();
        }
        return false;
    };

    isMinimized(): boolean {
        if (this.__objNSPanel) {
            return this.__objNSPanel.isMinimized();
        }
        return false;
    };

    isFullScreen(): boolean {
        if (this.__objNSPanel) {
            return this.__objNSPanel.isFullScreen();
        }
        return false;
    };

    alert(message: string | INSMessageBoxAlertSetting, title?: string, callback?: INSMessageBoxCallbackFunction): void {
        this.__createComponent();
        this.objNSComp.alert(message, title, callback);
        this.__creationHandler();
    };

    confirm(message: string | INSMessageBoxConfirmSetting, title?: string, confirmCallback?: INSMessageBoxCallbackFunction, cancelCallback?: INSMessageBoxCallbackFunction): void {
        this.__createComponent();
        this.objNSComp.confirm(message, title, confirmCallback, cancelCallback);
        this.__creationHandler();
    };

    custom(setting: INSMessageBoxCustomSetting): void {
        this.__createComponent();
        if (!setting) {
            setting = {};
        }
        if(setting.bodyComponent) {
            setting.bodyComponent = this.__customBodyComponent(setting.bodyComponent,(instance: any) => {
                setting["bodyComponentInstance"] = instance;
                this.__bodyComponentInstance = instance;
            });
            /*setting.contentComponent = this.customEditor(setting.contentComponent, instance => {
                setting["bodyComponentInstance"] = instance;
                this.__bodyComponentInstance = instance;
                this.objNSComp.custom(setting);
                this.__creationHandler();
            });*/
        }
        else if(!setting.bodyContent && !setting.bodyTemplate && !setting.bodyContent) {
            if (!setting.bodyContent && this.__objBodyContent) {
                setting.bodyContent = this.__objBodyContent;
            }
        }
        this.objNSComp.custom(setting);
        this.__creationHandler();
    };

    close(): void {
        this.__createComponent();
        this.objNSComp.close();
    };

    removeModal(): void {
        if (this.objNSComp) {
            this.objNSComp.removeModal();
        }
        this.__objNSPanel = null;
    };

    changeButtonStyle(btnIdentifier: any, objStyle: any): void {
        if (this.objNSComp) {
            this.objNSComp.changeButtonStyle(btnIdentifier, objStyle);
        }
    }

    getPanel(): any {
        return this.__objNSPanel;
    };

    private __createComponent(): void {
        if (!this.objNSComp) {
            this.objNSComp = new NSMessageBox(this.setting);
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
            this.hasInitialized = true;
        }
    };

    private __customBodyComponent(customEditorComponent: any,mainCallback: any): new () => CustomBodyComponent {
        const parentIns = this;

        return class extends CustomBodyComponent {
            constructor() {
                super(parentIns, customEditorComponent, mainCallback);
            }
        };
    };

    private __creationHandler(): void {
        this.__objNSPanel = this.objNSComp.getPanel();
        if (!this.element) {
            this.element = this.__objNSPanel.getBaseElement();
        }
    };

    private __getComponent(rendererComponent: any, paramCallback?: any, prop?: any): Promise<any> {
        return new Promise((parResolve, parReject) => {
            let params = {};
            if (prop) {
                params = prop;
            }

            const instance  = this.dynamicComponentService.createComponentRef(rendererComponent, this.dynamicContainer);
            const componentRef = instance;
            const objComponent = this.dynamicComponentService.getInstance(componentRef);

            /*this.__objCustomComponent = {
                instance: objComponent,
                componentRef: componentRef,
                component: rendererComponent,
                data: params,
            };*/

            paramCallback && paramCallback(instance, objComponent);
            parResolve({ instance, objComponent, params });
    
            /*const onInstanceCreated = (instance: any, container: HTMLElement | null, portal: React.ReactPortal) => {
                paramCallback && paramCallback(null, instance, container);
                parResolve({ instance, container, portal });
            };
    
            const portal = this.createUpdatedPortal(rendererComponent, params, onInstanceCreated);
            this.setState((prevState: any) => {
                //console.log("Previous State:", prevState);
                this.hasPortalUpdated = true;
                return {
                    dynamicComponents: [...prevState.dynamicComponents, portal],
                };
            });*/
        });
    };

    /*private customEditor(customEditorComponent: any, mainCallback: (instance: any) => void): any {
        const self: any = this;
        const editor = function(this: any) {
            let componentRef: any;
            let objComponent: any;

            this.init = async (data: any): Promise<any> => {
                const instance  = await self.dynamicComponentService.createComponentRef(customEditorComponent, self.dynamicContainer);
                componentRef = instance;
                objComponent = self.dynamicComponentService.getInstance(componentRef);
                if (objComponent?.init) {
                    mainCallback(objComponent);
                    objComponent.init(data);
                }
                self.__objCustomComponent = { instance: objComponent, componentRef, component: customEditorComponent, data };
                self.emitRendererComponentCreated(self.__objCustomComponent);
            };

            this.getElement = () => objComponent?.getElement();
            this.elementAdded = () => objComponent?.elementAdded();
            this.fullScreenChanged = (isFullScreen: boolean) => objComponent?.fullScreenChanged(isFullScreen);
            this.destroy = () => objComponent?.destroy();
        };

        return editor;
    }*/

    private __emitRendererComponentCreated(objItem:any)
    {
        this.rendererComponentCreated.emit(objItem);
    };

}

class CustomBodyComponent {
    private objComponent: any = null;
    private componentRef: any = null;
    private containerRef!: HTMLElement;
    private parentInstance: any;
    private customEditorComponent: any;
    private mainCallback: any;

    constructor(parentInstance: any, customEditorComponent: any, mainCallback: any) {
        this.parentInstance = parentInstance;
        this.customEditorComponent = customEditorComponent;
        this.mainCallback = mainCallback;
    }

    public init(data: any): Promise<any> {
        return new Promise((parResolve, parReject) => {
            const callback = (dynamicCompRef: MessageBoxComponentRef, localComponentRef: any, container: HTMLElement) => {
                this.componentRef = dynamicCompRef;
                this.containerRef = container;

                if (localComponentRef) {
                    this.objComponent = localComponentRef["component"] ? localComponentRef["component"] : localComponentRef;
                    this.containerRef = this.objComponent.getElement();

                    if (this.objComponent && this.objComponent.init) {
                        this.mainCallback && this.mainCallback(this.objComponent);
                        this.objComponent.init(data);
                    }

                    this.parentInstance.__objCustomComponent = {
                        instance: this.objComponent,
                        componentRef: this.componentRef,
                        component: this.customEditorComponent,
                        data: data,
                    };

                    this.parentInstance.__emitRendererComponentCreated(this.parentInstance.__objCustomComponent);
                    parResolve(localComponentRef);
                } /*else {
                    this.parentInstance.updateCallbacksOnUpdate.push({
                        callback: callback,
                        dynamicCompRef: dynamicCompRef,
                        container: container,
                        data: data
                    });
                }*/
            };

            this.parentInstance.__getComponent(this.customEditorComponent, callback, data);
        });
    }

    public getElement(): HTMLElement {
        return this.containerRef;
    }

    public elementAdded(): void {
        if (this.objComponent && this.objComponent.elementAdded) {
            this.objComponent.elementAdded();
        }
    }

    public destroy(): void {
        if (this.objComponent && this.objComponent.destroy) {
            this.objComponent.destroy();
        }
    }
}