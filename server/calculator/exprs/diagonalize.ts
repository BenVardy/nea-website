import { IExpr, TExprParam } from '../../types';
import { Matrix } from '../models';

export default class Diagonalize implements IExpr {
    public symbol: string = 'diagonalize';
    public precedence: number = 0;
    public noParams: number = 1;
    public final: boolean = true;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 1) throw new Error('Can only have 1 param');

        let [param] = params;
        if (param.type !== 'matrix') throw new Error('Param must be a matrix');

        try {
            let diagonalForm: Matrix[] = (param.data as Matrix).diagonalize();
            return diagonalForm.map(matrix => ({
                type: 'matrix',
                data: matrix
            }));
        } catch (ex) {
            throw ex;
        }
    }
}
