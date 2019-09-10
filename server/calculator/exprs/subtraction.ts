import { Plus, Times } from '.';
import { IExpr, TExprParam } from '../../types';

export default class Subtraction implements IExpr {
    public symbol: string = '-';
    public precedence: number = 3;
    public noParams: number = 2;
    public final: boolean = false;

    public execute(...params: TExprParam[]): TExprParam[] {
        if (params.length !== this.noParams) throw new Error('Must have 2 params');

        let [param1, param2] = params;

        return new Plus().execute(param1, ...new Times().execute({type: 'no', data: -1}, param2));
    }
}
