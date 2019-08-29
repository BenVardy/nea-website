import { IExpr, IExprParam, TCalc } from '../types';
import { Stack } from './models';

function isIExpr(obj: any): obj is IExpr {
    return 'execute' in obj;
}

/**
 * Executes the calculation given
 * @param calc The calculation. Should be in RPN
 */
export default function execCalc(calc: TCalc[]): IExprParam[] {
    let stack = new Stack<IExprParam>();

    for (let item of calc) {
        if (isIExpr(item)) {
            let params: IExprParam[] = [];

            try {
                params = stack.pop(item.noParams);
                if (params.length !== item.noParams) throw new Error('Not enough params');
            } catch (ex) {
                throw ex;
            }
            let results: IExprParam[] = item.execute(params);
            if (item.final) return results;
            else stack.push(results[0]);
        } else {
            stack.push(item);
        }
    }

    return stack.pop();
}
