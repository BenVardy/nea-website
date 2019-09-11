import { IExpr, TExprParam } from '../../types';
import {Matrix, Vector} from '../models';

export default class Multiplication implements IExpr {
    public symbol: string = '*';
    public final: boolean = false;
    public noParams: number = 2;
    public precedence: number = 2;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== 2) throw new Error('Must have 2 params');

        let [param1, param2] = params;
        if (param1.type === 'no') {
            if (param2.type === 'no') {
                return [{
                    type: 'no',
                    data: (param1.data as number) * (param2.data as number)
                }];
            } else {
                return [{
                    type: param2.type,
                    data: (param2.data as Matrix|Vector).multiply(param1.data as number)
                }];
            }
        } else if (params.every(param => param.type === 'vector')) {
            return [{
                type: 'no',
                data: (param1.data as Vector).dotMultiply(param2.data as Vector)
            }];
        } else if (param1.type === 'matrix' && param2.type === 'matrix') {
            return [{
                type: 'matrix',
                data: (param1.data as Matrix).multiply(param2.data as Matrix)
            }];
        } else if (param1.type === 'matrix' && param2.type === 'vector') {
            return [{
                type: 'vector',
                data: (param1.data as Matrix).multiply(param2.data as Vector)
            }];
        } else {
            throw new Error('Invalid multiplication');
        }
    }
}
