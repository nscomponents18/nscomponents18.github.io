import { Directive, ElementRef, inject } from '@angular/core';
import { ScriptLoaderService } from '../../script-loader.service';
import { HttpClient } from '@angular/common/http';

declare var NSUtil: any;

@Directive({
    selector: '[nsBaseDirective]',
    standalone: false,
})
export abstract class NSBaseDirective {
    protected scriptLoader: ScriptLoaderService = inject(ScriptLoaderService);
    private elementRef: ElementRef = inject(ElementRef);
    private http: HttpClient = inject(HttpClient);
    protected element!: HTMLElement;
    protected nsUtil: typeof NSUtil;
    protected arrEvents: string[] = [];

    constructor() {
        this.element = this.elementRef.nativeElement;
        this.nsUtil = new NSUtil();
    }

    getElement(): HTMLElement {
        return this.element;
    }

    protected initializeScripts(compName: string[]): void {
        this.scriptLoader.embedScripts(compName);
    }

    protected initializeEvents(arrEvents: string[]): void {
        this.arrEvents = arrEvents;
        this.addEvents();
    }

    protected addEvents(): void {
        for (const eventName of this.arrEvents) {
            this.nsUtil.addEvent(this.element, eventName, ((eventNameParam: string) => {
                return (event: any) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    this.eventListener(event, eventNameParam);
                };
            })(eventName));
        }
    }

    protected eventListener(event: any, eventName: string): void {
        // To be overridden by child directives
        console.warn(`Event listener triggered for event: ${eventName}`, event);
    }

    protected injectCSS(cssString: string, styleId?: string): void {
        if(cssString && (!styleId || !document.getElementById(styleId))) {
            const styleElement = document.createElement('style');
            if(styleId) {
                styleElement.id = styleId;
            }
            styleElement.textContent = cssString;
            document.head.appendChild(styleElement);
        }
    }

    protected loadCSS(cssPath: string): void {
        const resolvedPath = this.getLibraryCssPath(cssPath);
        this.http.get(resolvedPath, { responseType: 'text' }).subscribe(
          (cssContent) => {
            const style = document.createElement('style');
            style.textContent = cssContent;
            document.head.appendChild(style);
          },
          (error) => {
            console.error('Failed to load CSS file:', error);
          }
        );
      }
      
      protected getLibraryCssPath(relativePath: string): string {
        const basePath = this.getBaseLibraryPath();
        return `${basePath}/${relativePath}`;
      }
      
      protected getBaseLibraryPath(): string {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const src = scripts[i].src;
          if (src.includes('ns-components-angular')) {
            return src.substring(0, src.lastIndexOf('/'));
          }
        }
        return '';
      }
}
