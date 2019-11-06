import { ICalc, IExpr, TCalc } from '../types';
import { Stack } from './models';

/**
 * Performs the shuntingYard algorithm to change a parsed calculation from infix to postfix
 *
 * @param calc The infix calculation
 */
export default function shuntingYard(calc: TCalc[]): TCalc[] {
    let stack = new Stack<ICalc<'bracket'|'expr'>>();
    let output: TCalc[] = [];

    for (let item of calc) {
        if (item.type.match(/^(no|matrix|vector)$/)) {
            output.push(item);
        } else if (item.type === 'bracket') {
            if (item.data === '(') {
                stack.push(item as ICalc<'bracket'>);
            } else {
                while (!stack.isEmpty()) {
                    let topStack = stack.pop();
                    if (topStack.type === 'bracket') break;
                    output.push(topStack);
                }
            }
        } else if (item.type === 'expr') {
            // Should be a safe typecast as type 'expr' means that data is an Expr
            let currentExpr = item.data as IExpr;

            while (!stack.isEmpty()) {
                let topStack = stack.peek();
                if (topStack.type === 'bracket') break;

                let topExpr = topStack.data as IExpr;
                if (currentExpr.precedence <= topExpr.precedence) {
                    break;
                }

                output.push(stack.pop());
            }

            stack.push(item as ICalc<'expr'>);
        }
    }

    return output.concat(stack.popAll());
}
