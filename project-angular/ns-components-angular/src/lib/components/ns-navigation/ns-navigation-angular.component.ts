import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { INSNavigationMenu, INSNavigationSetting } from "./interfaces";
import { ScriptLoaderService } from "../../script-loader.service";
import { NSBaseComponent } from "../ns-base";

declare var NSNavigation: any;

export interface INSNavigationAngularSettings extends INSNavigationSetting {
    setting?: INSNavigationSetting;
    containerStyle?: any;
    [propName: string]: any;
}

@Component({
    selector: 'ns-navigation-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsNavigation.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})
export class NSNavigationAngular extends NSBaseComponent<typeof NSNavigation> implements OnChanges, OnInit, AfterViewInit {
    @Input() set setting(value: INSNavigationAngularSettings) {
        this.__setting = value;
        if (!this.objNSComp && this.__setting) {
            if (this.__dataSource) {
                this.__manageDataSource();
                this.__setting!.dataSource = this.dataSource || [];
            }
            this.objNSComp = new NSNavigation(this.element, this.__setting);
            this.hasInitialized = true;
        }
    }
    get setting(): INSNavigationAngularSettings | null | undefined {
        return this.__setting;
    }
    @Input() set dataSource(arrSource: INSNavigationMenu[]) {
        this.__dataSource = arrSource;
        if (this.objNSComp) {
            this.__manageDataSource();
            this.objNSComp.dataSource(arrSource);
        }
    }
    get dataSource(): INSNavigationMenu[] | null | undefined {
        return this.__dataSource;
    }


    @Output() navigationOpenStart: EventEmitter<any> = new EventEmitter();
    @Output() navigationOpenEnd: EventEmitter<any> = new EventEmitter();
    @Output() navigationCloseStart: EventEmitter<any> = new EventEmitter();
    @Output() navigationCloseEnd: EventEmitter<any> = new EventEmitter();
    @Output() navigationMenuSelected: EventEmitter<any> = new EventEmitter();
    @Output() navigationMenuDeselected: EventEmitter<any> = new EventEmitter();

    private __dataSource: INSNavigationMenu[] | null | undefined;
    private __setting: INSNavigationAngularSettings | null | undefined;

    constructor(private router: Router) {
        super();
        this.initializeScripts(['NSNavigation']);
    };

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        /*if(!this.objNSComp && this.__setting)
        {
            this.__manageDataSource();
            if(this.__dataSource)
            {
                this.setting["dataSource"] = this.dataSource;
            }
            this.objNSComp = new NSNavigation(this.__element,this.setting);
        }*/
    };

    ngOnInit(): void {
        this.initializeEvents([NSNavigation.NAVIGATION_OPEN_START,
            NSNavigation.NAVIGATION_OPEN_END,
            NSNavigation.NAVIGATION_CLOSE_START,
            NSNavigation.NAVIGATION_CLOSE_END,
            NSNavigation.NAVIGATION_MENU_SELECTED,
            NSNavigation.NAVIGATION_MENU_DESELECTED]);
        
        /*let eventHandler: any = this.__navEventHandler.bind(this);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_OPEN_START, eventHandler);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_OPEN_END, eventHandler);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_CLOSE_START, eventHandler);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_CLOSE_END, eventHandler);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_MENU_SELECTED, eventHandler);
        util.addEvent(this.__element, NSNavigation.NAVIGATION_MENU_DESELECTED, eventHandler);*/
    };

    ngAfterViewInit(): void {
    };

    isNavOpen(): Boolean {
        return (this.objNSComp ? this.objNSComp.isNavOpen() : false);
    };

    toggleNavigation(): void {
        if (this.objNSComp) {
            this.objNSComp.toggleNavigation();
        }
    };

    openNavigation(): void {
        if (this.objNSComp) {
            this.objNSComp.openNavigation();
        }
    };

    closeNavigation(): void {
        if (this.objNSComp) {
            this.objNSComp.closeNavigation();
        }
    };

    selectMenu(itemOrElement: any): void {
        if (this.objNSComp) {
            this.objNSComp.selectMenu(itemOrElement);
        }
    };

    setDataSource(source: INSNavigationMenu[]): void {
        if (this.objNSComp) {
            this.__manageDataSource();
            this.objNSComp.dataSource(source);
        }
    };

    setStyle(styleProp: String, value: any) {
        if (this.objNSComp) {
            this.objNSComp.setStyle(styleProp, value);
        }
    };

    setFocus(isFocus: boolean) {
        if (this.objNSComp) {
            this.objNSComp.setFocus(isFocus);
        }
    };

    hasFocus(): boolean {
        if (this.objNSComp) {
            return this.objNSComp.hasFocus();
        }
        return false;
    };

    setTheme(theme: string) {
        if (this.objNSComp) {
            this.objNSComp.setTheme(theme);
        }
    };

    private __manageDataSource(): void {
        if (this.dataSource && this.dataSource.length > 0) {
            for (let source of this.dataSource) {
                this.__manageDataSourceItem(source);
            }
        }
    };

    private __manageDataSourceItem(item: INSNavigationMenu): void {
        if (item) {
            if (item.childMenus && item.childMenus.length > 0) {
                for (let childMenu of item.childMenus) {
                    this.__manageDataSourceItem(childMenu);
                }
            }
            else {
                item["click"] = this.__menuClickHandler.bind(this);
            }
        }
    };

    private __menuClickHandler(event: any, item: INSNavigationMenu, li: any): void {
        if (item) {
            let navigateAction = true;
            if (item.onClick) {
                navigateAction = item.onClick(event, item, li);
            }
            if (this.router && navigateAction && (item.href || item["link"])) {
                const newRoute = item.href || item["link"];
                const formattedRoute = newRoute.startsWith('/') ? newRoute : `/${newRoute}`;
                this.router.navigate([formattedRoute]);
            } else {
                console.log('Navigation is not available');
            }
        }
    };
}