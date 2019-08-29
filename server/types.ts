/**
 * A parameter as part of the request
 */
export interface IReqParam {
    type: ('expr'|'matrix'|'no');
    /**
     * Should be a string or a string[][]
     */
    data: any;
}

/**
 * A parameter for a calculation
 */
export interface IExprParam {
    type: ('matrix'|'no'|'vector');
    /**
     * Must be a Matrix, number, or vector
     */
    data: any;
}

/**
 * A server-side expression. Must be stateless
 */
export interface IExpr {
    /**
     * The string representation of the expression
     */
    symbol: string;
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
    execute(params: IExprParam[]): IExprParam[];
}

export type TCalc = IExpr|IExprParam;
