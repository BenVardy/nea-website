import { IExpr, TExprParam } from '../../types';
import { Matrix, Vector } from '../models';

/**
 * Adds things together. Has 2 params
 */
export default class Plus implements IExpr {
    public symbol: string = '+';
    public precedence: number = 3;
    public noParams: number = 2;
    public final: boolean = false;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 2) throw new Error('Must have 2 params');

        let [param2, param1] = params;
        console.log(params);
        if (param1.type !== param2.type) throw new Error('Must be the same type');

        if (param1.type === 'matrix') {
            let data1 = param1.data as Matrix;
            let data2 = param2.data as Matrix;

            return [{
                type: 'matrix',
                data: data1.add(data2)
            }];
        } else if (param1.type === 'vector') {
            let data1 = param1.data as Vector;
            let data2 = param2.data as Vector;

            return [{
                type: 'vector',
                data: data1.add(data2)
            }];
        } else {
            let data1 = param1.data as number;
            let data2 = param2.data as number;

            return [{
                type: 'no',
                data: data1 + data2
            }];
        }
    }
}
