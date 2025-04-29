import { NgModule } from '@angular/core';

import { NSNavigationAngular, NSTextBoxAngular, NSMultiSelectDropdownAngular, NSPanelAngular, NSCalendarAngular, NSDatePickerAngular, 
  NSDashboardAngular, NSDynamicComponentService, NSGridAngular, NSMessageBoxAngular, 
  NSTableRowMoverAngularDirective} from '../public-api';
import { NSTabNavigatorAngular } from './components/ns-tab-navigator/ns-tab-navigator-angular.component';
import { NSHorizontalNavigationAngular } from './components/ns-horizontal-navigation';
import { NSEditorAngular } from './components/ns-editor/ns-editor-angular.component';
import { NSNumericTextBoxAngular } from './components/ns-numeric-textbox';

const components = [
  NSTextBoxAngular,
  NSNavigationAngular,
  NSMultiSelectDropdownAngular,
  NSPanelAngular,
  NSCalendarAngular,
  NSDatePickerAngular,
  NSDashboardAngular,
  NSMessageBoxAngular,
  NSGridAngular,
  NSTabNavigatorAngular,
  NSHorizontalNavigationAngular,
  NSEditorAngular,
  NSNumericTextBoxAngular,
  NSTableRowMoverAngularDirective 
];

@NgModule({
    declarations: [...components],
    imports: [],
    exports: [...components],
    providers: [
      NSDynamicComponentService
    ]
  })
  export class NSComponentsModule { }