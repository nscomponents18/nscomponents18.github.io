const fs = require('fs');
const path = require('path');

// Get the directory of the current script
const scriptDir = __dirname;

// Function to embed JS file into a TS file
function embedJsFile(jsFilePath, outputTsFilePath, exportName) {
  const jsCode = fs.readFileSync(jsFilePath, 'utf8');
  const tsContent = `export const ${exportName}Code = ${JSON.stringify(jsCode)};`;
  fs.writeFileSync(outputTsFilePath, tsContent, 'utf8');
}

const mapJSSource = {
    nsUtil: { jsFile: 'nsUtil.min.js', tsFile: 'nsUtil.ts', module: 'NSUtil' },
    nsContainerBase: { jsFile: 'nsContainerBase.min.js', tsFile: 'nsContainerBase.ts', module: 'NSContainerBase' },
    nsDateUtil: { jsFile: 'nsDateUtil.min.js', tsFile: 'nsDateUtil.ts', module: 'NSDateUtil' },
    nsExport: { jsFile: 'nsExport.min.js', tsFile: 'nsExport.ts', module: 'NSExport' },
    nsPromise: { jsFile: 'nsPromise.min.js', tsFile: 'nsPromise.ts', module: 'NSPromise' },
    nsVirtualScroll: { jsFile: 'nsVirtualScroll.min.js', tsFile: 'nsVirtualScroll.ts', module: 'NSVirtualScroll' },
    nsTableRowMover: { jsFile: 'nsTableRowMover.min.js', tsFile: 'nsTableRowMover.ts', module: 'NSTableRowMover' },
    nsEvent: { jsFile: 'nsEvent.min.js', tsFile: 'nsEvent.ts', module: 'NSEvent' },
    nsSVG: { jsFile: 'nsSVG.min.js', tsFile: 'nsSVG.ts', module: 'NSSVG' },
    nsAjax: { jsFile: 'nsAjax.min.js', tsFile: 'nsAjax.ts', module: 'NSAjax' },
    nsMessageBox: { jsFile: 'nsMessageBox.min.js', tsFile: 'nsMessageBox.ts', module: 'NSMessageBox' },
    nsPanel: { jsFile: 'nsPanel.min.js', tsFile: 'nsPanel.ts', module: 'NSPanel' },
    nsRouter: { jsFile: 'nsRouter.min.js', tsFile: 'nsRouter.ts', module: 'NSRouter' },
    nsGrid: { jsFile: 'nsGrid.min.js', tsFile: 'nsGrid.ts', module: 'NSGrid' },
    nsEditor: { jsFile: 'nsEditor.min.js', tsFile: 'nsEditor.ts', module: 'NSEditor' },
    nsTextBox: { jsFile: 'nsTextBox.min.js', tsFile: 'nsTextBox.ts', module: 'NSTextBox' },
    nsConsole: { jsFile: 'nsConsole.min.js', tsFile: 'nsConsole.ts', module: 'NSConsole' },
    nsDividerBox: { jsFile: 'nsDividerBox.min.js', tsFile: 'nsDividerBox.ts', module: 'NSDividerBox' },
    nsExpressionEvaluator: { jsFile: 'nsExpressionEvaluator.min.js', tsFile: 'nsExpressionEvaluator.ts', module: 'NSExpressionEvaluator' },
    nsMultiSelectDropdown: { jsFile: 'nsMultiSelectDropdown.min.js', tsFile: 'nsMultiSelectDropdown.ts', module: 'NSMultiSelectDropdown' },
    nsPinTip: { jsFile: 'nsPinTip.min.js', tsFile: 'nsPinTip.ts', module: 'NSPinTip' },
    nsScroller: { jsFile: 'nsScroller.min.js', tsFile: 'nsScroller.ts', module: 'NSScroller' },
    nsTouchToMouse: { jsFile: 'nsTouchToMouse.min.js', tsFile: 'nsTouchToMouse.ts', module: 'NSTouchToMouse' },
    nsCalendar: { jsFile: 'nsCalendar.min.js', tsFile: 'nsCalendar.ts', module: 'NSCalendar' },
    nsDatePicker: { jsFile: 'nsDatePicker.min.js', tsFile: 'nsDatePicker.ts', module: 'NSDatePicker' },
    nsDashboard: { jsFile: 'nsDashboard.min.js', tsFile: 'nsDashboard.ts', module: 'NSDashboard' },
    nsList: { jsFile: 'nsList.min.js', tsFile: 'nsList.ts', module: 'NSList' },
    nsHorizontalNavigation: { jsFile: 'nsHorizontalNavigation.min.js', tsFile: 'nsHorizontalNavigation.ts', module: 'NSHorizontalNavigation' },
    nsNumericTextBox: { jsFile: 'nsNumericTextBox.min.js', tsFile: 'nsNumericTextBox.ts', module: 'NSNumericTextBox' },
    nsPagination: { jsFile: 'nsPagination.min.js', tsFile: 'nsPagination.ts', module: 'NSPagination' },
    nsProgressBar: { jsFile: 'nsProgressBar.min.js', tsFile: 'nsProgressBar.ts', module: 'NSProgressBar' },
    nsTabNavigator: { jsFile: 'nsTabNavigator.min.js', tsFile: 'nsTabNavigator.ts', module: 'NSTabNavigator' },
    nsNavigation: { jsFile: 'nsNavigation.min.js', tsFile: 'nsNavigation.ts', module: 'NSNavigation' },
    nsXlsxExport: { jsFile: 'nsXlsxExport.min.js', tsFile: 'nsXlsxExport.ts', module: 'NSXlsxExport' },
    nsDocxExport: { jsFile: 'nsDocxExport.min.js', tsFile: 'nsDocxExport.ts', module: 'NSDocxExport' },
    nsPluggins: { jsFile: 'nsPluggins.min.js', tsFile: 'nsPluggins.ts', module: 'NSPluggins' }
};

for (const key in mapJSSource) {
    if (mapJSSource.hasOwnProperty(key)) {
        const { jsFile, tsFile, module } = mapJSSource[key];
        const jsFilePath = path.resolve(scriptDir, 'src', 'generated', 'js', jsFile);
        const tsFilePath = path.resolve(scriptDir, 'src', 'embedded', tsFile);

        embedJsFile(jsFilePath, tsFilePath, module);
    }
}

// Paths to your JS files and output TS files
/*const nsUtilJsPath = path.resolve(scriptDir, 'src', 'generated', 'js', 'nsUtil.min.js');
const nsUtilTsPath = path.resolve(scriptDir, 'src', 'lib', 'embedded-nsUtil.ts');
embedJsFile(nsUtilJsPath, nsUtilTsPath, 'NSUtil');

const nsTextBoxJsPath = path.resolve(scriptDir, 'src', 'generated', 'js', 'nsTextBox.min.js');
const nsTextBoxTsPath = path.resolve(scriptDir, 'src', 'lib', 'embedded-nsTextBox.ts');
embedJsFile(nsTextBoxJsPath, nsTextBoxTsPath, 'NSTextBox');

console.log('Embedded JS files into TypeScript modules.');*/
