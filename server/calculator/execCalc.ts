import { IExpr, TCalc, TExprParam } from '../types';
import { Stack } from './models';

function isIExpr(obj: any): obj is IExpr {
    return 'execute' in obj;
}

/**
 * Executes the calculation given
 * @param calc The calculation. Should be in RPN
 */
export default function execCalc(calc: TCalc[]): TExprParam[] {
    let stack = new Stack<TExprParam>();

    for (let item of calc) {
        if (item.type === 'expr') {
            let expr: IExpr = item.data as IExpr;
            let params: TExprParam[] = [];

            try {
                params = stack.pop(expr.noParams);
                if (params.length !== expr.noParams) throw new Error('Not enough params');
            } catch (ex) {
                throw ex;
            }
            let results: TExprParam[] = expr.execute(...params);
            if (expr.final) return results;
            else stack.push(results[0]);
        } else {
            // If type !== 'expr' then it must be one of the others
            // which are all valid => safe typecast
            stack.push(item as TExprParam);
        }
    }

    return stack.popAll();
}
