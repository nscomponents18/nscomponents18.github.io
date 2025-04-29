import { Injectable } from '@angular/core';

import { NSUtilCode } from '../embedded/nsUtil';
import { NSContainerBaseCode } from '../embedded/nsContainerBase';
import { NSDateUtilCode } from '../embedded/nsDateUtil';
import { NSExportCode } from '../embedded/nsExport';
import { NSPromiseCode } from '../embedded/nsPromise';
import { NSAjaxCode } from '../embedded/nsAjax';
import { NSTextBoxCode } from '../embedded/nsTextBox';
import { NSMessageBoxCode } from '../embedded/nsMessageBox';
import { NSPanelCode } from '../embedded/nsPanel';
import { NSDividerBoxCode } from '../embedded/nsDividerBox';
import { NSExpressionEvaluatorCode } from '../embedded/nsExpressionEvaluator';
import { NSMultiSelectDropdownCode } from '../embedded/nsMultiSelectDropdown';
import { NSScrollerCode } from '../embedded/nsScroller';
import { NSDashboardCode } from '../embedded/nsDashboard';
import { NSHorizontalNavigationCode } from '../embedded/nsHorizontalNavigation';
import { NSNumericTextBoxCode } from '../embedded/nsNumericTextBox';
import { NSPaginationCode } from '../embedded/nsPagination';
import { NSProgressBarCode } from '../embedded/nsProgressBar';
import { NSTabNavigatorCode } from '../embedded/nsTabNavigator';
import { NSTableRowMoverCode } from '../embedded/nsTableRowMover';
import { NSVirtualScrollCode } from '../embedded/nsVirtualScroll';
import { NSEventCode } from '../embedded/nsEvent';
import { NSSVGCode } from '../embedded/nsSVG';
import { NSConsoleCode } from '../embedded/nsConsole';
import { NSTouchToMouseCode } from '../embedded/nsTouchToMouse';
import { NSDatePickerCode } from '../embedded/nsDatePicker';
import { NSDocxExportCode } from '../embedded/nsDocxExport';
import { NSEditorCode } from '../embedded/nsEditor';
import { NSGridCode } from '../embedded/nsGrid';
import { NSListCode } from '../embedded/nsList';
import { NSNavigationCode } from '../embedded/nsNavigation';
import { NSPlugginsCode } from '../embedded/nsPluggins';
import { NSXlsxExportCode } from '../embedded/nsXlsxExport';
import { NSCalendarCode } from '../embedded/nsCalendar';

/*Whenever embed-js-files.js runs these ts files are generated 
 * so if you add a new then run the command npm run build:library-win 
 * and the ts file will be generated and compile time error will go away
*/
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private scriptsLoaded: { [url: string]: boolean } = {};
  private embeddedScripts: Record<string, string> = {};

  constructor() {
    this.embeddedScripts = {
      NSUtil: NSUtilCode,
      NSContainerBase: NSContainerBaseCode,
      NSDateUtil: NSDateUtilCode,
      NSExport: NSExportCode,
      NSPromise: NSPromiseCode,
      NSAjax: NSAjaxCode,
      NSTextBox: NSTextBoxCode,
      NSMessageBox: NSMessageBoxCode,
      NSPanel: NSPanelCode,
      NSDividerBox: NSDividerBoxCode,
      NSExpressionEvaluator: NSExpressionEvaluatorCode,
      NSMultiSelectDropdown: NSMultiSelectDropdownCode,
      NSScroller: NSScrollerCode,
      NSDashboard: NSDashboardCode,
      NSHorizontalNavigation: NSHorizontalNavigationCode,
      NSNumericTextBox: NSNumericTextBoxCode,
      NSPagination: NSPaginationCode,
      NSProgressBar: NSProgressBarCode,
      NSTabNavigator: NSTabNavigatorCode,
      NSTableRowMover: NSTableRowMoverCode,
      NSVirtualScroll: NSVirtualScrollCode,
      NSEvent: NSEventCode,
      NSSVG: NSSVGCode,
      NSConsole: NSConsoleCode,
      NSTouchToMouse: NSTouchToMouseCode,
      NSCalendar: NSCalendarCode,
      NSDatePicker: NSDatePickerCode,
      NSList: NSListCode,
      NSNavigation: NSNavigationCode,
      NSXlsxExport: NSXlsxExportCode,
      NSDocxExport: NSDocxExportCode,
      NSPluggins: NSPlugginsCode,
      NSGrid: NSGridCode,
      NSEditor: NSEditorCode
    };

    this.embedScripts(['NSUtil','NSContainerBase','NSDateUtil','NSExport','NSSVG']);
  }

  embedAllScripts() {
    for (const [name, code] of Object.entries(this.embeddedScripts)) {
      this.loadEmbeddedScript(name, code);
    }
  }

  embedScripts(names: string[]) {
    if (names?.length) {
      for (const name of names) {
        this.embedScript(name);
      }
    }
  }

  embedScript(name: string) {
    if (name in this.embeddedScripts) {
      this.loadEmbeddedScript(name, this.embeddedScripts[name])
    }
    else {
      console.warn(`${name} is not a valid script.`);
    }
  }

  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptsLoaded[url]) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        this.scriptsLoaded[url] = true;
        resolve();
      };
      script.onerror = () => reject(new Error(`Script load error: ${url}`));
      document.head.appendChild(script);
    });
  }

  private loadEmbeddedScript(name: string, code: string): void {
    if (this.scriptsLoaded[name]) {
      return;
    }
    console.log("Loading... " + name);
    const script = document.createElement('script');
    const sourceURL = "\n\n//# sourceURL=" + name + ".js";
    script.textContent = code + sourceURL;
    script.id = "script-" + name;
    document.head.appendChild(script);
    this.scriptsLoaded[name] = true;
  }
}
