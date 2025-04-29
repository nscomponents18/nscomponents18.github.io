export interface INSNumericTextBoxSetting {
    type?: string;
    enableDecimals?: boolean;
    decimals?: number;
    grouping?: number;
    min?: number;
    max?: number;
    value?: string;
    enableThousand?: boolean;
    decimalSeparator?: string;
    thousandSeparator?: string;
    enableHover?: boolean;
    theme?: string;
    customClass?: any;
    enableSpinner?: boolean;
    incrementerProp?: any;
    decrementerProp?: any;
    step?: number;
    format?: string;
    enableRangeRoundOf?: boolean;
    customFormatSpecifier?: string;
    input?: HTMLInputElement;
}