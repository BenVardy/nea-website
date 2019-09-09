import { IExpr, TExprParam } from '../../types';
import { Matrix, QR, QR_Result } from '../models';

/**
 * Finds eigenvalues and vectors of a matrix. Has 1 param
 */
export default class Eigen implements IExpr {
    public symbol: string = 'eigen';
    public precedence: number = 0;
    public noParams: number = 1;
    public final: boolean = true;

    public execute(params: TExprParam[]): TExprParam[] {
        if (params.length !== 1) throw new Error('Can only have 1 param');

        let [param] = params;
        if (param.type !== 'matrix') throw new Error('Param must be a matrix');

        let results: QR_Result[];
        try {
            results = QR(param.data as Matrix);
        } catch (ex) {
            /** @todo Add exception handling */
            throw ex;
        }

        let output: TExprParam[] = [];

        results.forEach(res => {
            output.push({
                type: 'no',
                data: res.eigenvalue
            });

            output.push({
                type: 'no',
                data: res.eigenvector
            });
        });

        return output;
    }
}
