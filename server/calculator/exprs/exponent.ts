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

        let exponent: number = (param2.data as number);

        if (param1.type === 'no') {
            return [{
                type: 'no',
                data: Math.pow(param1.data as number, exponent)
            }];
        } else if (param1.type === 'matrix') {
            let matrix: Matrix = param1.data as Matrix;
            let finalMatrix: Matrix;

            if (exponent === -1) {
                finalMatrix = matrix.invert();
            } else if (exponent > 0) {
                finalMatrix = matrix.clone();
                for (let i = 0; i < (param2.data as number); i++) {
                    finalMatrix = finalMatrix.multiply(matrix);
                }
            } else {
                throw new Error('Invalid exponent');
            }

            return [{
                type: 'matrix',
                // Put in to the power
                data: finalMatrix
            }];
        } else {
            throw new Error('Cannot take powers of vectors');
        }
    }
}
