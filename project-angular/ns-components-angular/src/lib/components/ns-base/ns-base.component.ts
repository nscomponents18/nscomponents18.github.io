import { Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../script-loader.service';

declare var NSUtil: any;

export interface NSComponent {
    removeComponent(): void;
};

@Component({
    selector: 'ns-base',
    template: '',
    standalone: false
})
export abstract class NSBaseComponent<T extends NSComponent> implements OnDestroy {
    protected scriptLoader: ScriptLoaderService = inject(ScriptLoaderService);
    private elementRef: ElementRef = inject(ElementRef);
    protected element!: HTMLElement;
    protected nsUtil: typeof NSUtil;
    protected arrEvents: string[] = [];
    protected objNSComp: T | null = null;
    protected hasInitialized: boolean = false;
    protected hasDestroyed: boolean = false;

    constructor() {
        this.element = this.elementRef.nativeElement;
        this.nsUtil = new NSUtil();
    }

    getElement(): HTMLElement {
        return this.element;
    };

    protected initializeScripts(compName: string[]): void {
        this.scriptLoader.embedScripts(compName);
    }
    
    protected initializeEvents(arrEvents: string[]): void {
        this.arrEvents = arrEvents;
        this.addEvents();
    }

    protected addEvents() {
        for (const eventName of this.arrEvents) {
            this.nsUtil.addEvent(this.element, eventName, ((eventNameParam: string) => {
                return (event: any) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    this.eventListener(event,eventNameParam);
                }
            })(eventName));
        }
    }

    protected eventListener(event: any,eventName: string)
    {
        //@ts-ignore
        this[event.type].emit(event.detail, event);
    }

    ngOnDestroy(): void 
    {
        if(this.hasInitialized)
        {
            this.hasDestroyed = true;
            if(this.objNSComp && this.objNSComp.removeComponent)
            {
                this.objNSComp.removeComponent();
                this.objNSComp = null;
            }
        }
        this.destroy();
    };

    destroy(): void {
    }
}
