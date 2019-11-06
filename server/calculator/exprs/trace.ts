import { IExpr, TExprParam } from '../../types';
import { Matrix } from '../models';

export default class Trace implements IExpr {
    public symbol: string = 'tr';
    public final: boolean = false;
    public noParams: number = 1;
    public precedence: number = 1;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 1) throw new Error('Can only have one param');

        let [param] = params;
        if (param.type !== 'matrix') throw new Error('Must be a matrix');

        return [{
            type: 'no',
            data: (param.data as Matrix).trace()
        }];
    }
}
