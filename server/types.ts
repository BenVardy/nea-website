import { Matrix, Vector } from './calculator/models';

/**
 * A server-side expression. Must be stateless
 */
export interface IExpr {
    /**
     * The string representation of the expression
     */
    symbol: string;
    /**
     * The precedence of the expr. 0 is the highest
     */
    precedence: number;
    /**
     * The number of parameters of the expression
     */
    noParams: number;
    /**
     * If executing the command should end the program.
     * If the expression produces more than one output this must be true
     */
    final: boolean;
    /**
     * Executes the expression
     * @param params The parameters to the expression
     */
    execute(params: TExprParam[]): TExprParam[];
}

export interface ICalcData {
    // string in this case should only be '(' or ')'
    bracket: string;
    expr: IExpr;
    matrix: Matrix;
    no: number;
    vector: Vector;
}

export interface ICalc<T extends keyof ICalcData> {
    type: T;
    data: ICalcData[T];
}

export type TCalc = ICalc<keyof ICalcData>;
export type TExprParam = ICalc<'matrix'|'no'|'vector'>;
