import { IExpr, TExprParam } from '../../types';
import { Matrix } from '../models';

export default class Transpose implements IExpr {
    public symbol: string = 'transpose';
    public precedence: number = 0;
    public noParams: number = 1;
    public final: boolean = false;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 1) throw new Error('Can only have 1 param');

        let [param] = params;
        if (param.type !== 'matrix') throw new Error('Param must be a matrix');

        let matrix: Matrix = param.data as Matrix;

        return [{
            type: 'matrix',
            data: matrix.transposed()
        }];
    }
}
