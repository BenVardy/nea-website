import { IExpr, TExprParam } from '../../types';

export default class Times implements IExpr {
    public symbol: string = '*';
    public final: boolean = false;
    public noParams: number = 2;
    public precedence: number = 2;

    public execute(params: TExprParam[]): any {
        return;
    }
}
