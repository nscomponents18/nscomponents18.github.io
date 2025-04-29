import { Injectable, ApplicationRef, ComponentRef, Type, Injector, ViewContainerRef, EmbeddedViewRef, Renderer2, ComponentFactoryResolver, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NSDynamicComponentService {
    private renderer: Renderer2;
    constructor(private applicationRef: ApplicationRef,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver,
        rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    /**
     * Create a component reference dynamically.
     * @param componentClass The component class to create.
     * @param viewContainerRef Optional ViewContainerRef to host the component.
     * @param inputs Optional object containing @Input properties to set on the component instance.
     */
    createComponentRef<T>(componentClass: Type<T>, viewContainerRef?: ViewContainerRef, inputs?: Partial<T>): ComponentRef<T> {
        let componentRef: ComponentRef<T>;
        if (viewContainerRef) {
            // If ViewContainerRef is provided, create the component within it
            componentRef = viewContainerRef.createComponent(componentClass, { injector: this.injector });
        } else {
            // Create the component independently
            /*const componentRef = this.applicationRef.bootstrap(componentClass); // Standalone component instantiation
            const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);
            return componentRef;*/
            const containerElement = this.renderer.createElement('div');
            this.renderer.appendChild(document.body, containerElement);

            // Create an embedded view to host the component
            const tempViewContainerRef = this.createViewContainerRef(containerElement);

            // Create the component within the temporary view container
            componentRef = tempViewContainerRef.createComponent(componentClass, {
                injector: this.injector,
            });
        }
        if(componentRef) {
            if(inputs) {
                Object.assign((componentRef.instance as any), inputs);
            }
            componentRef.changeDetectorRef.detectChanges();
        }
        return componentRef;
    }

    private createViewContainerRef(element: HTMLElement): ViewContainerRef {
        const embeddedView = this.applicationRef
            .components[0]
            .instance
            .viewContainerRef
            .createEmbeddedView({});

        this.applicationRef.attachView(embeddedView);
        embeddedView.rootNodes.forEach((node: any) => {
            this.renderer.appendChild(element, node);
        });

        return embeddedView.injector.get(ViewContainerRef);
    }

    getInstance<T>(componentRef: ComponentRef<T>): T {
        // Access the instance of the dynamically created component
        return componentRef.instance;
    }

    getDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
        // Get the root DOM element of the component
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    destroyComponent<T>(componentRef: ComponentRef<T>, delay = 0): void {
        // Destroy the component with an optional delay
        setTimeout(() => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, delay);
    }
}
