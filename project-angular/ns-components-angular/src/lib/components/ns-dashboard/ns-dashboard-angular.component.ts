import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { INSDashboardPanelSetting, INSDashboardSetting } from './interfaces';
import { NSBaseComponent } from '../ns-base';
import { NSDynamicComponentService } from '../../services/ns-dynamic-component.service';

declare const NSDashboard: any;

export interface INSDashboardAngularSetting extends INSDashboardSetting {
    setting?: INSDashboardSetting;
    containerStyle?: any;
    [propName: string]: any;
}

@Component({
    selector: 'ns-dashboard-angular',
    template: '<ng-template #dynamicContainer></ng-template>',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsComponent.min.css";
        @import "../../../generated/css/nsDashboard.min.css";
    `],
    encapsulation: ViewEncapsulation.None,
    providers:[NSDynamicComponentService]
})
export class NSDashboardAngular extends NSBaseComponent<typeof NSDashboard> implements OnInit, AfterViewInit {
    @Input() setting: INSDashboardAngularSetting | undefined | null;
    @Input() containerStyle: any;

    @Output() panelDragStart = new EventEmitter<any>();
    @Output() panelDragEnter = new EventEmitter<any>();
    @Output() panelDragOver = new EventEmitter<any>();
    @Output() panelDragLeave = new EventEmitter<any>();
    @Output() panelDrop = new EventEmitter<any>();
    @Output() panelDragEnd = new EventEmitter<any>();

    @Output() rendererComponentCreated:EventEmitter<any> = new EventEmitter();

    @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
    dynamicContainer!: ViewContainerRef;

    private arrCustomComponents: any[] = [];
    private arrComponentInstances: any[] = [];

    constructor(private dynamicComponentService: NSDynamicComponentService) { 
        super();
        this.initializeScripts(['NSDashboard']);
    }

    ngOnInit(): void {
        this.initializeComponent();
        this.hasInitialized = true;
    }

    ngAfterViewInit(): void {
    }

    override destroy(): void {
        for (let comp of this.arrCustomComponents) {
            comp?.componentRef?.destroy();
        }
    }

    private initializeComponent(): void {
        if(this.setting && !this.objNSComp) {
            if (this.setting?.arrPanelSetting) {
                this.setting.arrPanelSetting.forEach((panelSetting, index) => {
                    this.initPanel(panelSetting, index);
                });
            }
            this.setting.container = this.element;
            this.objNSComp = new NSDashboard(this.setting);
            this.initializeEvents([NSDashboard.PANEL_DRAG_START,
                NSDashboard.PANEL_DRAG_ENTER,
                NSDashboard.PANEL_DRAG_OVER,
                NSDashboard.PANEL_DRAG_LEAVE,
                NSDashboard.PANEL_DROP,
                NSDashboard.PANEL_DRAG_END
            ]);
            this.hasInitialized = true;
        }
    }

    private initPanel(setting: INSDashboardPanelSetting, index: number): void {
        if (setting.contentComponent) {
            setting.contentComponent = this.customEditor(setting.contentComponent, index, instance => {
                setting.bodyComponentInstance = instance;
                this.arrComponentInstances[index] = instance;
            });
        }
    }

    private customEditor(customEditorComponent: any, index: number, mainCallback: (instance: any) => void): any {
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
                self.arrCustomComponents[index] = { instance: objComponent, componentRef, component: customEditorComponent, data };
                self.emitRendererComponentCreated(self.arrCustomComponents[index]);
            };

            this.getElement = () => {
                if(objComponent && objComponent.getElement) {
                    return objComponent.getElement();
                }
                return null;
            }
            this.elementAdded = () => {
                if(objComponent && objComponent.elementAdded) {
                    objComponent.elementAdded();
                }
            }
            this.fullScreenChanged = (isFullScreen: boolean) => {
                if(objComponent && objComponent.fullScreenChanged) {
                    objComponent.fullScreenChanged(isFullScreen);
                }
            }
            this.destroy = () => {
                if(objComponent && objComponent.destroy) {
                    objComponent.destroy();
                }
            }
        };

        return editor;
    }

    private emitRendererComponentCreated(objItem:any)
    {
        this.rendererComponentCreated.emit(objItem);
    };
}