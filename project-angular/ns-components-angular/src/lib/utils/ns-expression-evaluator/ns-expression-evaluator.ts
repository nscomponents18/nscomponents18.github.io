import { NSExpressionEvaluatorCode } from '../../../embedded/nsExpressionEvaluator';

declare var NSExpressionEvaluator: any;

export class NSExpressionEvaluatorAngular {
    private evaluator: any;

    constructor(private settings?: any) {
        this.loadScript();
        this.instantiateEvaluator();
    }

    private loadScript(): void {
        if (!(window as any).NSExpressionEvaluator) {
            const name = 'NSExpressionEvaluator';
            const code = NSExpressionEvaluatorCode;
            const script = document.createElement('script');
            const sourceURL = '\n\n//# sourceURL=' + name + '.js';
            script.textContent = code + sourceURL;
            script.id = 'script-' + name;
            document.head.appendChild(script);
        }
    }

    private instantiateEvaluator(): void {
        if ((window as any).NSExpressionEvaluator) {
            this.evaluator = new NSExpressionEvaluator(this.settings);
        } else {
            setTimeout(() => this.instantiateEvaluator(), 0);
        }
    }

    evaluate(expression: string, model: any): any {
        return this.evaluator.evaluate(expression, model);
    }

    setExpression(expression: string): void {
        this.evaluator.setExpression(expression);
    }
}


/*export class NSExpressionEvaluatorAngular {
  private evaluator: any;

  constructor(private settings?: any) {
    this.loadScript();
  }

  private loadScript(): void {
    if(!(window as any).NSExpressionEvaluator) {
        const name = 'NSExpressionEvaluator';
        const code = NSExpressionEvaluatorCode;
        const script = document.createElement('script');
        const sourceURL = "\n\n//# sourceURL=" + name + ".js";
        script.textContent = code + sourceURL;
        script.id = "script-" + name;
        document.head.appendChild(script);
    }
    this.evaluator = new NSExpressionEvaluator(this.settings);
  }

  evaluate(expression: string, model: any): any {
    return this.evaluator.evaluate(expression, model);
  }

  setExpression(expression: string): void {
    this.evaluator.setExpression(expression);
  }
}*/
