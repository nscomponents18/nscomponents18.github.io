import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { INSHorizontalNavigationMenu, INSHorizontalNavigationSetting } from "./interfaces";
import { NSBaseComponent } from "../ns-base";

declare var NSHorizontalNavigation: any;

export interface INSHorizontalNavigationAngularSettings extends INSHorizontalNavigationSetting {
    setting?: INSHorizontalNavigationSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-horizontal-navigation-angular',
    template: '',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsHorizontalNavigation.min.css";
    `],
    encapsulation: ViewEncapsulation.None
})
export class NSHorizontalNavigationAngular extends NSBaseComponent<typeof NSHorizontalNavigation> implements OnChanges, OnInit, AfterViewInit {
    @Input() setting!: INSHorizontalNavigationAngularSettings;
    @Input() dataSource: INSHorizontalNavigationMenu[] = [];

    @Output() navigationMenuSelected: EventEmitter<any> = new EventEmitter();

    constructor(private router: Router) {
        super();
        this.initializeScripts(['NSHorizontalNavigation']);
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['dataSource'] && this.objNSComp) {
            this.objNSComp.dataSource(this.dataSource);
            this.__manageDataSource();
        }
    }

    ngOnInit(): void {
        if (!this.objNSComp) {
            this.initializeEvents([NSHorizontalNavigation.NAVIGATION_MENU_SELECTED]);
            const container = this.element;
            this.setting.dataSource = this.dataSource;
            this.objNSComp = new NSHorizontalNavigation(container, this.setting);
            this.__manageDataSource();
            this.hasInitialized = true;
        }
    }

    ngAfterViewInit(): void {}

    selectMenu(itemOrElement: any): void {
        if (this.objNSComp) {
            this.objNSComp.selectMenu(itemOrElement);
        }
    }

    setDataSource(source: INSHorizontalNavigationMenu[]): void {
        if (this.objNSComp) {
            this.objNSComp.dataSource(source);
            this.__manageDataSource();
        }
    }

    setStyle(styleProp: string, value: any): void {
        if (this.objNSComp) {
            this.objNSComp.setStyle(styleProp, value);
        }
    }

    setFocus(isFocus: boolean): void {
        if (this.objNSComp) {
            this.objNSComp.setFocus(isFocus);
        }
    }

    hasFocus(): boolean {
        return this.objNSComp?.hasFocus() || false;
    }

    setTheme(theme: string): void {
        if (this.objNSComp) {
            this.objNSComp.setTheme(theme);
        }
    }

    private __manageDataSource(): void {
        if (this.dataSource?.length > 0) {
            for (let source of this.dataSource) {
                this.__manageDataSourceItem(source);
            }
        }
    }

    private __manageDataSourceItem(item: INSHorizontalNavigationMenu): void {
        if (item) {
            if (item.childMenus?.length) {
                for (let childMenu of item.childMenus) {
                    this.__manageDataSourceItem(childMenu);
                }
            } else {
                item["click"] = this.__menuClickHandler.bind(this);
            }
        }
    }

    private __menuClickHandler(event: any, item: INSHorizontalNavigationMenu): void {
        if (item) {
            let navigateAction = true;
            if (item.onClick) {
                navigateAction = item.onClick(event, item);
            }
            if (this.router && navigateAction && (item.href || item["link"])) {
                const newRoute = item.href || item["link"];
                const formattedRoute = newRoute.startsWith('/') ? newRoute : `/${newRoute}`;
                this.router.navigate([formattedRoute]);
            } else {
                console.log('Navigation is not available');
            }
        }
    }
}
