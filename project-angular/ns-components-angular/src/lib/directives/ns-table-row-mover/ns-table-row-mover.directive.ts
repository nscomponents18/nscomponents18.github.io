import { Directive, Input } from '@angular/core';
import { INSTableRowMoverSetting } from './interfaces';
import { NSBaseDirective } from '../ns-base-directive';

declare var NSTableRowMover: any;

const cssDraggable: string = `
                                .nsDraggableRow{
                                }
                                .nsDraggableRow.nsDraggableRowDrag
                                {
                                    cursor: move;	
                                }
                                .nsDraggableCloneRow{
                                    background: #FFF;
                                    position: absolute;
                                }
                                .nsDraggableCloneRow > table {
                                    border-collapse: collapse;
                                }

                                .nsDraggableCloneRow > table,.nsDraggableCloneRow > th,.nsDraggableCloneRow > td {
                                    border: 1px solid black;
                                }
                                .nsDraggingRow {
                                    box-shadow:3px 5px 6px -4px rgba(0,0,0,0.8);
                                }
                                .nsDraggingRow > td {
                                    position:relative;
                                    z-index: 9999;
                                }
                                .nsDraggingRow > td:first-child::before {
                                    border-top-left-radius:5px;
                                    border-bottom-left-radius:5px;
                                }
                                .nsDraggingRow > td:last-child::before {
                                    border-top-right-radius:5px;
                                    border-bottom-right-radius:5px;
                                }
                                .nsDraggingRow > td::before {
                                    background-color:white;
                                    box-shadow:3px 5px 6px -4px rgba(0,0,0,0.8);
                                    display:block;
                                    padding:0 9px 0 0;
                                    content:'';
                                    position:absolute;
                                    left:0;
                                    top:0;
                                    z-index:-1;
                                    width:100%;
                                    height:100%;
                                }
                                .nsDottedRow > td:first-child 
                                {
                                    border-left: 2px dotted red!important;
                                }
                                .nsDottedRow > td
                                {
                                    border-top: 2px dotted red!important;
                                    border-bottom: 2px dotted red!important;
                                }
                                .nsDottedRow > td:last-child 
                                {
                                    border-right: 2px dotted red!important;
                                }
                                .nsTableRowMoverGhost {
                                    background: #e5e5e5;
                                    border: 1px solid black;
                                    cursor: move;
                                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 1.4;
                                    overflow: hidden;
                                    padding: 3px;
                                    position: absolute;
                                    text-overflow: ellipsis;
                                    -webkit-user-select: none;
                                    -moz-user-select: none;
                                    -ms-user-select: none;
                                    user-select: none;
                                    background: white;
                                    border-radius: 2px;
                                    box-shadow: none;
                                    padding: 4px;
                                    border: 1px solid #BDC3C7;
                                    color: rgba(0, 0, 0, 0.54);
                                    font-weight: 600;
                                    font-size: 12px;
                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                                    height: 32px !important;
                                    line-height: 32px;
                                    margin: 0;
                                    padding: 0 8px;
                                    transform: translateY(8px);
                                    z-index: 10000;
                                }
                                .nsTableRowMoverAnimation {
                                    position: absolute;
                                    -webkit-transition: top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s, -webkit-transform 0.4s;
                                    transition: top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s, -webkit-transform 0.4s;
                                    transition: transform 0.4s, top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s;
                                    transition: transform 0.4s, top 0.4s, height 0.4s, background-color 0.1s, opacity 0.2s, -webkit-transform 0.4s;
                                }`;


export interface INSTableRowMoverAngularSetting extends INSTableRowMoverSetting {
}

@Directive({
    selector: '[nsTableRowMoverAngular]',
    standalone: false
})
export class NSTableRowMoverAngularDirective extends NSBaseDirective {
    private __objNSTableRowMover: typeof NSTableRowMover | null = null;
    private __setting: INSTableRowMoverAngularSetting | undefined;

    @Input()
    set setting(value: INSTableRowMoverAngularSetting) {
        this.__setting = value;
        if (this.__setting) {
            this.__create();
        }
    }
    get setting(): INSTableRowMoverAngularSetting {
        return this.__setting!;
    }

    constructor() {
        super();
        this.initializeScripts(['NSTableRowMover']);
        this.injectCSS(cssDraggable, 'ns-table-row-mover-angular-style');
    }

    ngOnInit(): void {
        //this.loadCSS('../../../generated/css/nsComponent.min.css');
        //this.loadCSS('node_modules/ns-components-angular/generated/css/nsComponent.min.css');
    }

    ngOnDestroy(): void {
        this.remove();
    }

    processRows(): void {
        if (this.__objNSTableRowMover) {
            this.__objNSTableRowMover.processRows();
        }
    }

    remove(): void {
        if (this.__objNSTableRowMover) {
            this.__objNSTableRowMover.remove();
            this.__objNSTableRowMover = null;
        }
    }

    private __create(): void {
        if (!this.__objNSTableRowMover && this.__setting) {
            this.__setting.table = this.getElement();
            this.__objNSTableRowMover = new NSTableRowMover(this.__setting);
        }
    }
}
