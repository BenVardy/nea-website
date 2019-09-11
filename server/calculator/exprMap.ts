import { IExpr } from '../types';
import * as Exprs from './exprs';

let output: {[key: string]: IExpr} = {};

Object.entries(Exprs).forEach(([_, TExpr]) => {
    const expr = new TExpr();

    output[expr.symbol] = expr;
});

export default output;
