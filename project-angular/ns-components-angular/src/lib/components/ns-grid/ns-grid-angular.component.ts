import { Component, ViewEncapsulation, OnChanges, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, SimpleChange, DoCheck, KeyValueChangeRecord, ComponentRef, ViewChild, ViewContainerRef } from "@angular/core";

import { NSBaseComponent } from "../ns-base";
import { GridComponentRef, INSGridCascadeFunction, INSGridColumn, INSGridDetailRendererComponent, INSGridDetailRendererComponentInstance, INSGridDetailRendererComponentParam, INSGridEditorCustomComponentInstance, INSGridEditorCustomComponentSetting, INSGridExtraRowHeaderRendererComponentInstance, INSGridGroupRendererComponentInstance, INSGridHeaderRendererComponentInstance, INSGridMasterDetailSetting, INSGridRendererComponentInstance, INSGridSetting, INSGridToolTipRendererComponentInstance } from "./interfaces";
import { NSDynamicComponentService } from "../../services";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";

declare var NSGrid: any;

export interface INSGridAngularSetting extends INSGridSetting {
    setting?: INSGridSetting;
    [propName: string]: any;
}

@Component({
    selector: 'ns-grid-angular',
    template: '<ng-template #dynamicContainer></ng-template>',
    standalone: false,
    styles: [`
        @import "../../../generated/css/nsComponent.min.css";
        @import "../../../generated/css/nsGrid.min.css";
    `],
    encapsulation: ViewEncapsulation.None,
    providers:[NSDynamicComponentService]
})

export class NSGridAngular extends NSBaseComponent<typeof NSGrid> implements OnChanges, OnInit, AfterViewInit, DoCheck
{  
    @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
    dynamicContainer!: ViewContainerRef;
    
    @Input() setting: INSGridAngularSetting | undefined | null;
    @Input() set dataSource(arrSource:any[])
    {
        this.__dataSource = arrSource;
        if(this.objNSComp)
        {
            this.__objCustomComponent = {};
            if(this.__dataSource.length > 0)
            {
                this.__hasGridDataSource = true;
            }
            this.objNSComp?.dataSource(arrSource);
        }
    }
    get dataSource(): any[] | undefined
    {
        return this.__dataSource;
    }
  
    @Output() gridRendered:EventEmitter<any> = new EventEmitter();
    @Output() rowSelected:EventEmitter<any> = new EventEmitter();
    @Output() rowUnselected:EventEmitter<any> = new EventEmitter();
    @Output() rowClicked:EventEmitter<any> = new EventEmitter();
    @Output() rowDoubleClicked:EventEmitter<any> = new EventEmitter();
    @Output() rowNavigated:EventEmitter<any> = new EventEmitter();
    @Output() cellSelected:EventEmitter<any> = new EventEmitter();
    @Output() cellUnselected:EventEmitter<any> = new EventEmitter();
    @Output() cellClicked:EventEmitter<any> = new EventEmitter();
    @Output() cellDoubleClicked:EventEmitter<any> = new EventEmitter();
    @Output() sortChanging:EventEmitter<any> = new EventEmitter();
    @Output() sortChanged:EventEmitter<any> = new EventEmitter();
    @Output() advancedFilterClosing:EventEmitter<any> = new EventEmitter();
    @Output() filterChanging:EventEmitter<any> = new EventEmitter();
    @Output() filterChanged:EventEmitter<any> = new EventEmitter();
    @Output() filterResetted:EventEmitter<any> = new EventEmitter();
    @Output() columnResizing:EventEmitter<any> = new EventEmitter();
    @Output() columnResized:EventEmitter<any> = new EventEmitter();
    @Output() columnMoving:EventEmitter<any> = new EventEmitter();
    @Output() columnMoved:EventEmitter<any> = new EventEmitter();
    @Output() rendererComponentCreated:EventEmitter<any> = new EventEmitter();
    @Output() editorCellValueChanged:EventEmitter<any> = new EventEmitter();

    @Output() detailComponentCreated:EventEmitter<any> = new EventEmitter();
    
    public static readonly GRID_RENDERED = "gridRendered";
    public static readonly MULTI_SELECTION_EDITORS_TEXT = "TEXT";
    public static readonly MULTI_SELECTION_EDITORS_TEXTAREA = "TEXTAREA";
    public static readonly GRID_TYPE_HIERARCHICAL = "hierarchical";
    public static readonly GRID_TYPE_GROUP = "group";
    public static readonly GRID_TYPE_NORMAL = "normal";
    public static readonly GRID_TYPE_MASTER_DETAIL = "masterdetail";
    public static readonly PAGINATION_TYPE_SCROLL = "scroll";
    public static readonly PAGINATION_TYPE_PAGES = "pages";
    public static readonly PAGINATION_MODE_AUTO = "auto";
    public static readonly PAGINATION_MODE_MANUAL = "manual";
    public static readonly RESPONSIVE_MODE_STACK = "stack";
    public static readonly RESPONSIVE_MODE_COLUMN_TOGGLE = "columnToggle";
    public static readonly ADVANCED_FILTER_TEXT = "text";
    public static readonly ADVANCED_FILTER_NUMBER = "number";
    public static readonly ADVANCED_FILTER_LIST = "list";
    public static readonly MULTICOLUMN_KEY_SHIFT = "shift";
    public static readonly MULTICOLUMN_KEY_CTRL = "ctrl";
    public static readonly MULTICOLUMN_KEY_ALT = "alt";
    public static readonly NAVIGATION_UP = "up";
    public static readonly NAVIGATION_DOWN = "down";
    //Editors
    public static readonly EDITOR_EDITTYPE_CELL = "cell";
    public static readonly EDITOR_EDITTYPE_ROW = "row";
    public static readonly EDITOR_EDITING_SINGLECLICK = "singleClick";
    public static readonly EDITOR_EDITING_DOUBLECLICK = "doubleClick";
    public static readonly EDITOR_EDITING_NOCLICK = "noClick";
    public static readonly EDITOR_TYPE_TEXT = "text";
    public static readonly EDITOR_TYPE_TEXTAREA = "textArea";
    public static readonly EDITOR_TYPE_CUSTOM = "custom";

    private __dataSource:any[] | undefined;
    private __objCustomComponent: any;
    private __masterDetailRendererInstance!: INSGridDetailRendererComponentInstance[];
    private __hasGridDataSource: boolean = false;
    private __detectSettingChanges: boolean = false;
    private updateCallbacksOnUpdate: any[] = [];

    private __differ: any;
    private __gridRendered: Promise<boolean> = new Promise<boolean>(resolve => {
            resolve(true);
        }
    );

    constructor(private dynamicComponentService: NSDynamicComponentService) 
    {
        super();
        this.initializeScripts(['NSGrid']);
    };
    
    ngOnInit() : void
    {
    };
  
    ngOnChanges(changes: {[propName: string]: SimpleChange}): void 
    {
        if(this.hasInitialized)
        {
            //console.log(changes);
        }
    };
    
    ngDoCheck() 
    {
        if(this.__hasGridDataSource)
        {
            if(this.__differ)
            {
                let changes: any = this.__differ.diff(this.setting);
                if(changes) 
                {
                    this.__applySettingChanges(changes);
                } 
            }
        }
    };
  
    ngAfterViewInit(): void 
    {
        if(!this.objNSComp && this.setting)
        {
            let setting:INSGridSetting = this.nsUtil.cloneObject(this.setting,true);
            setting.columns = this.__setColumn(this.setting.columns);
            setting.multiLevelGroupColumn = this.__setColumnObject(this.setting.multiLevelGroupColumn);
            setting.masterDetailSetting = this.__processMasterDetailSetting(setting.masterDetailSetting);
            setting.eventDispatcher = this.__eventDispatcher.bind(this);
            if(this.__dataSource)
            {
                setting["dataSource"] = this.__dataSource;
                if(this.__dataSource.length > 0)
                {
                    this.__hasGridDataSource = true;
                }
            }
            this.__objCustomComponent = {};
            this.objNSComp = new NSGrid(this.element,setting);
            //this.__differ = this.differs.find(this.setting).create(null);
            this.hasInitialized = true;
        }
    };
    
    setHeightOffset(offset : number) : void
    {
        this.objNSComp?.setHeightOffset(offset);
    };
    
    deviceViewChanged(conditionTrue : boolean,queryIndex : number = 0,query : string = "") : void
    {
        this.objNSComp?.deviceViewChanged(conditionTrue,queryIndex,query);
    };
    
    setState(data : any): void
    {
        this.objNSComp?.setState(data);
    };
    
    getState(): any
    {
        return this.objNSComp?.getState();
    };
    
    setColumn(arrColumns:INSGridColumn[]): void
    {
        this.objNSComp?.setColumn(this.__setColumn(arrColumns));
    };
    
    setContextMenuSetting(contextMenuSetting:any): void
    {
        this.objNSComp?.setContextMenuSetting(contextMenuSetting);
    };
    
    getOrignalItem(item : any): void
    {
        return this.objNSComp?.getOrignalItem(item);
    };
    
    addRows(source : any[]): void
    {
        this.objNSComp?.addRows(source);
    };
    
    removeRows(arrIndex : any[]): void
    {
        this.objNSComp?.removeRows(arrIndex);
    };
    
    groupBy(groupByField : string): void
    {
        this.objNSComp?.groupBy(groupByField);
    };
    
    expandAll(): void
    {
        this.objNSComp?.expandAll();
    };
    
    collapseAll(): void
    {
        this.objNSComp?.collapseAll();
    };
    
    expandCollapseByRow(element : any,rowIndex : number): void
    {
        this.objNSComp?.expandCollapseByRow(element,rowIndex);
    };
    
    getRowInfo(row : any): any
    {
        return this.objNSComp?.getRowInfo(row);
    };
    
    getCellInfo(cell : any): any
    {
        return this.objNSComp?.getCellInfo(cell);
    };
    
    getItemInfo(objItem : any): any
    {
        return this.objNSComp?.getItemInfo(objItem);
    };
    
    getItemInfoByKeyField(keyFieldValue : string): any
    {
        return this.objNSComp?.getItemInfoByKeyField(keyFieldValue);
    };
    
    cascadeValues(event: any,callBack: INSGridCascadeFunction): void
    {
        this.objNSComp?.cascadeValues(event,callBack);
    };
    
    setFontSize(fontSize: number): void
    {
        this.objNSComp?.setFontSize(fontSize);
    };
    
    addColumn(objColumn: INSGridColumn): void
    {
        this.objNSComp?.addColumn(this.__setColumnObject(objColumn));
    };
    
    changeDeviceView(conditionTrue: boolean): void
    {
        this.objNSComp?.changeDeviceView(conditionTrue);
    };
    
    hideColumn(column: string | Number): boolean
    {
        return this.objNSComp?.hideColumn(column);
    };
    
    showColumn(column: string | Number): boolean
    {
        return this.objNSComp?.showColumn(column);
    };
    
    swapColumns(sourceColumn: INSGridColumn,destinationColumn: INSGridColumn): boolean
    {
        return this.objNSComp?.swapColumns(sourceColumn,destinationColumn);
    };
    
    moveColumn(column: INSGridColumn,toIndex: number): boolean
    {
        return this.objNSComp?.moveColumn(column,toIndex) || false;
    };
    
    sortBy(column: INSGridColumn,isAscending: boolean): void
    {
        this.objNSComp?.sortBy(column,isAscending);
    };
    
    autoResizeColumn(column: INSGridColumn): void
    {
        this.objNSComp?.autoResizeColumn(column);
    };
    
    updateRowByIndex(index: number): void
    {
        this.objNSComp?.updateRowByIndex(index);
    };
    
    updateRowByKeyField(keyFieldValue: any): void
    {
        this.objNSComp?.updateRowByKeyField(keyFieldValue);
    };
    
    updateCellByIndex(index: number,dataField: string): void
    {
        this.objNSComp?.updateCellByIndex(index,dataField);
    };
    
    updateCellByKeyField(keyFieldValue: any,dataField: string): void
    {
        this.objNSComp?.updateCellByKeyField(keyFieldValue,dataField);
    };
    
    updateItemInDataSource(item: any): void
    {
        this.objNSComp?.updateItemInDataSource(item);
    };
    
    getGroupedSource(): any[]
    {
        return this.objNSComp?.getGroupedSource() || [];
    }
    
    setSelectedItems(arrItems: any[]): void
    {
        this.objNSComp?.setSelectedItems(arrItems);
    };
    
    addSelectedItems(arrItems: any[]): void
    {
        this.objNSComp?.addSelectedItems(arrItems);
    };
    
    removeSelectedItems(arrItems: any[]): void
    {
        this.objNSComp?.removeSelectedItems(arrItems);
    };
    
    setSelectedItem(item: any): void
    {
        this.objNSComp?.setSelectedItem(item);
    };
    
    setSelectedIndexes(arrSelectedIndex: number[]): void
    {
        this.objNSComp?.setSelectedIndexes(arrSelectedIndex);
    };
    
    getSelectedIndex(): number
    {
        return this.objNSComp?.getSelectedIndex();
    };
    
    getSelectedItem(): any
    {
        return this.objNSComp?.getSelectedItem();
    };
    
    getSelectedIndexes(): number[]
    {
        return this.objNSComp?.getSelectedIndexes();
    };
    
    getSelectedItems(): any[]
    {
        return this.objNSComp?.getSelectedItems();
    };
    
    deselectAll(): void
    {
        this.objNSComp?.deselectAll();
    };
    
    filter(filter: any,setting: any,enableHighlighting: boolean = false,recordLimit: number = -1): void
    {
        this.objNSComp?.filter(filter,setting,enableHighlighting,recordLimit);
    };
    
    resetFilters(): void
    {
        this.objNSComp?.resetFilters();
    };
    
    getFilteredData(): any[]
    {
        return this.objNSComp?.getFilteredData() || [];
    };
    
    highlightText(dataField: string,text: string): void
    {
        this.objNSComp?.highlightText(dataField,text);
    };
    
    unHighlightText(): void
    {
        this.objNSComp?.unHighlightText();
    };
    
    fixFixedHeader(): void
    {
        this.objNSComp?.fixFixedHeader();
    };
    
    scrollToIndex(selectedIndex: number,animationRequired: boolean = false): void
    {
        this.objNSComp?.scrollToIndex(selectedIndex,animationRequired);
    };
    
    setNoDataMessage(message: string): void
    {
        this.objNSComp?.setNoDataMessage(message);
    };
    
    renderHeaderExtraRows(): void
    {
        this.objNSComp?.renderHeaderExtraRows();
    };
    //Editor related public functions
    editByIndex(index: any,dataField?: string): void
    {
        this.objNSComp?.editByIndex(index,dataField);
    };
    editByKeyField(keyFieldValue: any,dataField?: string): void
    {
        this.objNSComp?.editByKeyField(keyFieldValue,dataField);
    };
    editByItem(item: any,dataField?: string): void
    {
        this.objNSComp?.editByItem(item,dataField);
    };
    editStopByIndex(index: any,dataField?: string,isCancel?:boolean): void
    {
        this.objNSComp?.editStopByIndex(index,dataField,isCancel);
    };
    editStopByKeyField(keyFieldValue: any,dataField?: string,isCancel?:boolean): void
    {
        this.objNSComp?.editStopByKeyField(keyFieldValue,dataField,isCancel);
    };
    editStopByItem(item: any,dataField?: string,isCancel?:boolean): void
    {
        this.objNSComp?.editStopByItem(item,dataField,isCancel);
    };
    getEditorInstances(): any[]
    {
        return this.objNSComp?.getEditorInstances();
    };
    //end of editor related public functions
    setStyle(styleProp: string,value: any): void
    {
        this.objNSComp?.setStyle(styleProp,value);
    };
    
    setFocus(isFocus: boolean): void
    {
        this.objNSComp?.setFocus(isFocus);
    };
    
    hasFocus(): boolean
    {
        return this.objNSComp?.hasFocus() || false;
    };
    
    setTheme(theme: string): void
    {
        this.objNSComp?.setTheme(theme);
    };
    
    changeProperty(propertyName: string,value: any): void
    {
        this.objNSComp?.changeProperty(propertyName,value);
    };
    
    getRendererComponentInstance(columnName:string,rowIndex: number): INSGridRendererComponentInstance | null
    {
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["renderer"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["renderer"];
        }
        return null;
    };
    
    getGroupRendererComponentInstance(columnName:string,rowIndex: number): INSGridGroupRendererComponentInstance | null
    {
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["groupRenderer"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["groupRenderer"];
        }
        return null;
    };
    
    getHeaderRendererComponentInstance(columnName:string): INSGridHeaderRendererComponentInstance | null
    {
        let rowIndex: number = 0;
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["headerRenderer"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["headerRenderer"];
        }
        return null;
    };
    
    getToolTipRendererComponentInstance(columnName:string,rowIndex: number): INSGridToolTipRendererComponentInstance | null
    {
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["toolTipRenderer"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["toolTipRenderer"];
        }
        return null;
    };
    
    getExtraRowHeaderRendererComponentInstance(columnName:string,rowIndex: number): INSGridExtraRowHeaderRendererComponentInstance | null
    {
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["extraRowHeaderRenderer"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["extraRowHeaderRenderer"];
        }
        return null;
    };
    
    getEditorComponentInstance(columnName:string,rowIndex: number): INSGridEditorCustomComponentInstance | null
    {
        if(this.__objCustomComponent && this.__objCustomComponent[columnName] && this.__objCustomComponent[columnName].length > rowIndex && this.__objCustomComponent[columnName][rowIndex]["editor"])
        {
            return this.__objCustomComponent[columnName][rowIndex]["editor"];
        }
        return null;
    };
    
    getGrid(): any
    {
        return  this.objNSComp;
    };
    
    private __applySettingChanges(changes: any): void 
    {
        if(this.__detectSettingChanges)
        {
            let self: any = this;
            let applyChange: any = function(record: KeyValueChangeRecord<string,any>)
            {
                self.objNSComp.changeProperty(record.key,record.currentValue);
            };
            changes.forEachChangedItem((record: KeyValueChangeRecord<string,any>) => applyChange(record));
            changes.forEachAddedItem((record: KeyValueChangeRecord<string,any>) =>  applyChange(record));
            changes.forEachRemovedItem((record: KeyValueChangeRecord<string,any>) => applyChange(record));
        }
       this.__detectSettingChanges = true;
    };
    
    private __setColumn(arrColumns:INSGridColumn[] | undefined): INSGridColumn[]
    {
        if(arrColumns && arrColumns.length > 0)
        {
            let retValue: INSGridColumn[] = [];
            for (let column of arrColumns)
            {
                retValue.push(this.__setColumnObject(column));
            }
            return retValue;
        }
        return [];
    };
    
    private __setColumnObject(objColumn: INSGridColumn | undefined): INSGridColumn
    {
        if(objColumn)
        {
            let self: any = this;
            if(objColumn.itemRendererComponent)
            {
                objColumn.itemRenderer = function(item: any,dataField: string,index: number,colIndex: number,row: any): any
                {
                    return self.__renderer(objColumn.itemRendererComponent,item,dataField,index,colIndex,row);
                };
            }
            if(objColumn.groupRendererComponent)
            {
                objColumn.groupRenderer = function(item: any,dataField: string,index: number,colIndex: number,row: any,arrChildren: any[],childrenCount: number,arrFlatChildren: any[],groupLevel:number): any
                {
                    return self.__groupRenderer(objColumn.groupRendererComponent,item,dataField,index,colIndex,row,arrChildren,childrenCount,arrFlatChildren,groupLevel);
                };
            }
            if(objColumn.headerRendererComponent)
            {
                objColumn.headerRenderer = function(colItem: INSGridColumn,colIndex: number): any
                {
                    return self.__headerRenderer(objColumn.headerRendererComponent,colItem,colIndex);
                };
            }
            if(objColumn.toolTipRendererComponent)
            {
                objColumn.toolTipRenderer = function(item: any,dataField: string,index: number,colIndex: number,row: any): any
                {
                    return self.__toolTipRenderer(objColumn.toolTipRendererComponent,item,dataField,index,colIndex,row);
                };
            }
            if(objColumn.extraRowHeaderRendererComponent)
            {
                objColumn.extraRowHeaderRenderer = function(dataField: string,colItem: INSGridColumn,arrFilteredGroupedSource: any[],rowIndex: number,colIndex: number,extraHeaderCell: any,extraHeaderRow: any): any
                {
                    return self.__extraRowHeaderRenderer(objColumn.extraRowHeaderRendererComponent,dataField,colItem,arrFilteredGroupedSource,rowIndex,colIndex,extraHeaderCell,extraHeaderRow);
                };
            }
            if(objColumn.editorSetting && objColumn.editorSetting.customEditor)
            {
                objColumn.editorSetting.customEditor = self.__customEditor(objColumn.editorSetting.customEditor,objColumn);
            }
        }
        return objColumn || {};
    };
    
    private __customEditor(customEditorComponent: any,objColumn: INSGridColumn): any
    {
        let self: any = this;
        let __editor: any = function(this: any)
        {
            let objComponent: any = null;
            let componentRef!: ComponentRef<any>;
            
            this.init = function(setting: INSGridEditorCustomComponentSetting): void
            {
                 let index: number = setting.rowIndex;
                 let objRef: any = self.__getComponent(customEditorComponent,objColumn.dataField,index);
                 objComponent = objRef.instance;
                 componentRef = objRef.ref;
                 objComponent.init(setting);
                 let objItem: INSGridEditorCustomComponentInstance = {instance: objComponent,componentRef: componentRef,setting: setting,colItem: objColumn,index: index,colIndex: setting.cellIndex,columnName: objColumn.dataField};
                 //self.__initializeCompInObject(objColumn.dataField, setting.rowIndex);
                 objColumn.dataField && (self.__objCustomComponent[objColumn.dataField][index]["editor"] = objItem);
                 self.__emitRendererComponentCreated(objItem);
            };
            this.getElement = function(): HTMLElement
            {
                return self.__getElement(componentRef);
            };
            this.elementAdded = function(): void
            {
                if(objComponent && objComponent.elementAdded)
                {
                    objComponent.elementAdded();
                }
            };
            this.handleKeyDown = function(event: any,keyCode: any): void
            {
                if(objComponent && objComponent.handleKeyDown)
                {
                    objComponent.handleKeyDown(event,keyCode);
                }
            };
            this.getValue = function(): any
            {
                return objComponent.getValue();
            };
            this.destroy = function(): void
            {
                if(objComponent && objComponent.destroy)
                {
                    objComponent.destroy();
                }
            };
            this.setFocus = function(): void
            {
                objComponent.setFocus();
            };
            this.hasFocus = function(): any
            {
                if(objComponent && objComponent.hasFocus)
                {
                    return objComponent.hasFocus();
                }
                return null;
            };
            this.hasValueChanged = function(currentValue: any): any
            {
                if(objComponent && objComponent.hasValueChanged)
                {
                    return objComponent.hasValueChanged(currentValue);
                }
                return null;
            };
            this.validate = function(): any
            {
                if(objComponent && objComponent.validate)
                {
                    return objComponent.validate();
                }
                return null;
            };
            this.isPopUp = function(): boolean
            {
                if (objComponent && objComponent.isPopUp) {
                    return objComponent.isPopUp();
                }
                return false;
            };
            this.save = function(): void
            {
                if(objComponent && objComponent.save)
                {
                    objComponent.save();
                }
            };
            this.cancel = function(): void
            {
                if(objComponent && objComponent.cancel)
                {
                    objComponent.cancel();
                }
            };
            this.setPopUpWrapper = function(popUpWrapper: HTMLElement): void
            {
                if(objComponent && objComponent.setPopUpWrapper)
                {
                    objComponent.setPopUpWrapper(popUpWrapper);
                }
            };
        };
        
        return __editor;
    };
    
    private __renderer(rendererComponent: any,item: any,dataField: string,index: number,colIndex: number,row: any): any
    {
        if(item)
        {
            let objRef: any = this.__getComponent(rendererComponent,dataField,index);
            let objComponent: any = objRef.instance;
            objComponent.setData(item,dataField,index,colIndex,row);
            this.__callAfterSetData(objRef.ref);
            let objItem: INSGridRendererComponentInstance = {instance: objComponent,componentRef: objRef.ref,item: item,index: index,colIndex: colIndex,columnName: dataField};
            this.__objCustomComponent[dataField][index]["renderer"] = objItem;
            //this.__initializeCompInObject(dataField, index);
            this.__emitRendererComponentCreated(objItem);
            return this.__getElement(objRef.ref);//objComponent.getElement();
        }
        return null;
    };
    
    private __groupRenderer(rendererComponent: any,item: any,dataField: string,index: number,colIndex: number,row: any,arrChildren: any[],childrenCount: number,arrFlatChildren: any[],groupLevel:number): any
    {
        if(item)
        {
            let objRef: any = this.__getComponent(rendererComponent,dataField,index);
            let objComponent: any = objRef.instance;
            objComponent.setData(item,dataField,index,colIndex,row,arrChildren,childrenCount,arrFlatChildren,groupLevel);
            this.__callAfterSetData(objRef.ref);
            let objItem:INSGridGroupRendererComponentInstance = {instance: objComponent,componentRef: objRef.ref,item: item,index: index,colIndex: colIndex,columnName: dataField};
            this.__objCustomComponent[dataField][index]["groupRenderer"] = objItem;
            this.__emitRendererComponentCreated(objItem);
            return this.__getElement(objRef.ref);//objComponent.getElement();
        }
        return null;
    };
    
    private __headerRenderer(rendererComponent: any,colItem: INSGridColumn,colIndex: number): any
    {
        if(colItem)
        {
            let dataField : string = colItem.dataField || '';
            let index : number = 0;
            let objRef: any = this.__getComponent(rendererComponent,dataField,index);
            let objComponent: any = objRef.instance;
            objComponent.setData(colItem,colIndex);
            this.__callAfterSetData(objRef.ref);
            let objItem: INSGridHeaderRendererComponentInstance = {instance: objComponent,componentRef: objRef.ref,index: index,colItem: colItem,colIndex: colIndex};
            this.__objCustomComponent[dataField][index]["headerRenderer"] = objItem;
            this.__emitRendererComponentCreated(objItem);
            return this.__getElement(objRef.ref);//objComponent.getElement();
        }
        return null;
    };
    
    private __toolTipRenderer(rendererComponent: any,item: any,dataField: string,index: number,colIndex: number,row: any): any
    {
        if(item)
        {
            let objRef: any = this.__getComponent(rendererComponent,dataField,index);
            let objComponent: any = objRef.instance;
            objComponent.setData(item,dataField,index,colIndex,row);
            this.__callAfterSetData(objRef.ref);
            let objItem: INSGridToolTipRendererComponentInstance = {instance: objComponent,componentRef: objRef.ref,item: item,index: index,colIndex: colIndex,columnName: dataField};
            this.__objCustomComponent[dataField][index]["toolTipRenderer"] = objItem;
            this.__emitRendererComponentCreated(objItem);
            return this.__getElement(objRef.ref);
        }
        return null;
    };
    
    private __extraRowHeaderRenderer(rendererComponent: any,dataField: string,colItem: INSGridColumn,filteredDataSource: any[],index: number,colIndex: number,extraHeaderCell: any,extraHeaderRow: any): any
    {
        if(colItem)
        {
            let objRef: any = this.__getComponent(rendererComponent,dataField,index);
            let objComponent: any = objRef.instance;
            objComponent.setData(dataField,colItem,filteredDataSource,index,colIndex,extraHeaderCell,extraHeaderRow);
            this.__callAfterSetData(objRef.ref);
            let objItem: INSGridExtraRowHeaderRendererComponentInstance = {instance: objComponent,componentRef: objRef.ref,colItem: colItem,index: index,colIndex: colIndex,columnName: dataField};
            this.__objCustomComponent[dataField][index]["extraRowHeaderRenderer"] = objItem;
            this.__emitRendererComponentCreated(objItem);
            return this.__getElement(objRef.ref);
        }
        return null;
    };

    private __processMasterDetailSetting(masterDetailSetting: INSGridMasterDetailSetting | undefined): INSGridMasterDetailSetting | undefined {
        if(masterDetailSetting) {
            if(masterDetailSetting.detailRenderer) {
                masterDetailSetting.detailRenderer = this.__customDetailComponent(masterDetailSetting.detailRenderer);
            }
        }
        return masterDetailSetting;
    }

    private __customDetailComponent(detailRenderer: INSGridDetailRendererComponent): new () => INSGridDetailRendererComponent {
        const parentIns = this;

        return class extends NSGridCustomDetailRenderer {
            constructor() {
                super(parentIns, detailRenderer);
            }
        };
    }    
    
    private __getComponent(rendererComponent: any,dataField: string | null, index: number, paramCallback?: any, prop?: any): any
    {
        let componentRef: ComponentRef<any> = this.dynamicComponentService.createComponentRef(rendererComponent, this.dynamicContainer);
        let objComponent: any = this.dynamicComponentService.getInstance(componentRef);
        if(dataField) {
            this.__initializeCompInObject(dataField, index);
        }
        return {ref: componentRef,instance: objComponent};
    };

    private __initializeCompInObject(dataField: string,index: number) {
        if(!this.__objCustomComponent[dataField])
        {
            this.__objCustomComponent[dataField] = [];
        }
        if(!this.__objCustomComponent[dataField][index])
        {
            this.__objCustomComponent[dataField][index] = {};
        }
    }

    private __eventDispatcher(eventType: string,data: any,param: any,bubbles: boolean= true,cancelable: boolean= false): void
    {
        if(!this.hasDestroyed)
        {
            let eventEmitter: any = <EventEmitter<any>> (<any>this)[eventType];
            if (eventEmitter) 
            {
                let event: any = {eventName: eventType,detail: data};
                if(param)
                {
                     for (let key in param) 
                     {
                         if(param.hasOwnProperty(key)) 
                         {
                             event[key] = param[key];
                         } 
                     }   
                }
                if (eventType === "gridRendered") 
                {
                    this.__gridRendered.then((result => {
                        eventEmitter.emit(event);
                    }));
                } 
                else 
                {
                    eventEmitter.emit(event);
                }
            } 
            else 
            {
                console.debug(eventType + " is not dispatched by NS-GRID Angular");
            }
        }  
    };

    private __emitRendererComponentCreated(objItem:any)
    {
        this.rendererComponentCreated.emit(objItem);
    };
    
    private __callAfterSetData(componentRef: ComponentRef<any>): void
    {
        componentRef.changeDetectorRef.detectChanges();
    };
    
    private __getElement(componentRef: ComponentRef<any>): any
    {
        return componentRef.location.nativeElement;
    };
}

class NSGridCustomDetailRenderer implements INSGridDetailRendererComponent {
    private objComponent: any = null;
    private componentRef: any = null;
    private containerRef!: HTMLElement;
    private parentIns: any;
    private detailRenderer: INSGridDetailRendererComponent;

    constructor(parentIns: any, detailRenderer: INSGridDetailRendererComponent) {
        this.parentIns = parentIns;
        this.detailRenderer = detailRenderer;
    }

    public init(param: INSGridDetailRendererComponentParam): Promise<any> {
        return new Promise((parResolve, parReject) => {
            const callback = (dynamicCompRef: GridComponentRef, localComponentRef: any, container: HTMLElement | null) => {
                this.componentRef = dynamicCompRef;
                //this.containerRef = container;

                if (localComponentRef) {
                    this.objComponent = localComponentRef["component"] ? localComponentRef["component"] : localComponentRef;
                    if(this.objComponent.getElement) {
                        this.containerRef = this.objComponent.getElement();
                    }
                    else {
                        this.containerRef = this.componentRef.location.nativeElement;
                    }

                    if (this.objComponent && this.objComponent.init) {
                        this.objComponent.init(param);
                    }

                    const objItem: INSGridDetailRendererComponentInstance = {
                        instance: this.objComponent,
                        componentRef: dynamicCompRef,
                        param: param
                    };

                    this.parentIns.__masterDetailRendererInstance[param.rowIndex] = objItem;
                    this.parentIns.detailComponentCreated.emit(objItem);
                    parResolve(dynamicCompRef);
                } else {
                    const objItem: INSGridDetailRendererComponentInstance = {
                        instance: null,
                        componentRef: this.componentRef,
                        param: param
                    };

                    this.parentIns.__masterDetailRendererInstance[param.rowIndex] = objItem;
                    this.parentIns.updateCallbacksOnUpdate.push({
                        callback: callbackSent,
                        dynamicCompRef: dynamicCompRef,
                        container: container,
                        objItem: objItem
                    });
                }
            };

            const callbackSent = callback.bind(this); // Ensure `this` refers to Renderer instance
            if (!this.parentIns.__masterDetailRendererInstance) {
                this.parentIns.__masterDetailRendererInstance = [];
            }
            /*let objRef: any = self.__getComponent(customEditorComponent,objColumn.dataField,index);
                 objComponent = objRef.instance;
                 componentRef = objRef.ref;*/
            const objRef: any = this.parentIns.__getComponent(this.detailRenderer, null, -1, callbackSent, param);
            callbackSent(objRef.ref, objRef.instance, null);
        });
    }

    public getElement(): HTMLElement {
        return this.containerRef;
    }

    public elementAdded(params: INSGridDetailRendererComponentParam): void {
        if (this.objComponent && this.objComponent.elementAdded) {
            this.objComponent.elementAdded(params);
        }
    }

    public renderEverytime(params: INSGridDetailRendererComponentParam): boolean {
        if (this.objComponent && this.objComponent.renderEverytime) {
            return this.objComponent.renderEverytime(params);
        }
        return true;
    }

    public destroy(): void {
        if (this.objComponent && this.objComponent.destroy) {
            this.objComponent.destroy();
        }
    }
};