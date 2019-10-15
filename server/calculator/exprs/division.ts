import { IExpr, TExprParam } from '../../types';
import {Matrix, Vector} from '../models';

export default class Division implements IExpr {
    public symbol: string = '/';
    public final: boolean = false;
    public noParams: number = 2;
    public precedence: number = 2;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 2) throw new Error('Must have 2 params');

        let [param1, param2] = params;
        if (param1.type === 'no' && param2.type === 'no') {
            return [{
                type: 'no',
                data: (param1.data as number) / (param2.data as number)
            }];
        } else if (param2.type === 'no') {
            if (param1.type === 'matrix') {
                return [{
                    type: 'matrix',
                    data: (param1.data as Matrix).multiply(1 / (param2.data as number))
                }];
            } else {
                // param1 must be a vector
                return [{
                    type: 'vector',
                    data: (param1.data as Vector).multiply(1 / (param2.data as number))
                }];
            }
        }

        throw new Error('Invalid division');
    }
}
