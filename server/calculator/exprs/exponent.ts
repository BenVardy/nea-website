import { IExpr, TExprParam } from '../../types';
import {Matrix} from '../models';

export default class Exponent implements IExpr {
    public symbol: string = '^';
    public final: boolean = false;
    public noParams: number = 2;
    public precedence: number = 2;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 2) throw new Error('Must have 2 params');

        let [param1, param2] = params;

        if (param2.type !== 'no') throw new Error('Must have an exponent of a number');

        if (param1.type === 'no') {
            return [{
                type: 'no',
                data: Math.pow(param1.data as number, param2.data as number)
            }];
        } else if (param1.type === 'matrix') {
            throw new Error('No matrix powers yet');
            return [{
                type: 'matrix',
                // Put in to the power
                data: (param1.data as Matrix)
            }];
        } else {
            throw new Error('Cannot take powers of vectors');
        }
    }
}
