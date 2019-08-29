import express from 'express';
import exprMap from './calculator/exprMap';
import { IExpr , IReqParam, TCalc, IExprParam } from './types';
import { Matrix } from './calculator/models';

/**
 * Tests if an object is a ReqParam array
 * @param obj The object to test
 */
function isReqParamArr(obj: any): obj is IReqParam[] {
    return (
        Array.isArray(obj) &&
        obj.every(elem => {
            let temp = elem as IReqParam;
            return (
                ['expr', 'matrix', 'no'].includes(temp.type) &&
                temp.data !== undefined
            );
        })
    );
}

function isStringArrArr(obj: any): obj is string[][] {
    return (
        Array.isArray(obj) &&
        obj.every(row => (
            Array.isArray(row) &&
            row.every(val => typeof val === 'string')
        ))
    );
}

/**
 * Joins a string of single expressions into one expression
 * @param currentPos The current Pos in the calculation
 * @param calc The rest of the calculation
 * @param type If we are joining expressions or numbers
 */
function join(currentPos: number, calc: IReqParam[], type: ('expr'|'no')): string {
    let current = calc[currentPos];

    if (typeof current.data !== 'string') throw new Error(`Invalid ${type}`);
    if (!current) return '';

    return current.type === type ? current.data + join(currentPos + 1, calc, type) : '';
}

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    let { body } = req;

    if (!isReqParamArr(body)) return res.status(400);

    let calc: TCalc[] = [];
    let i = 0;
    while (i < body.length) {
        let item: IReqParam = body[i];

        switch (item.type) {
            case 'expr':
                let joinedExpr: string = join(0, body.slice(i), 'expr');
                let expr: IExpr|undefined = exprMap[joinedExpr];
                if (!expr) throw new Error('Invalid Expression');
                calc.push(expr);
                i += joinedExpr.length;
            case 'matrix':
                if (!isStringArrArr(item.data)) throw new Error('Invalid Matrix');
                let data: number[][] = item.data.map(row => row.map(val => {
                    if (isNaN(+val)) throw new Error('Invalid Matrix');
                    return +val;
                }));
                let matrix: Matrix = new Matrix(data);
                calc.push({
                    type: matrix.getDim(0) === 2 && matrix.getDim(1) === 1 ? 'vector' : 'matrix',
                    data: matrix
                } as IExprParam);
                i++;
            case 'no':
                let joinedNo: string = join(0, body.slice(i), 'no');
                let no: number = +joinedNo;
                if (isNaN(no)) throw new Error('Invalid number');
                calc.push({
                    type: 'no',
                    data: no
                } as IExprParam);
                i += joinedNo.length;
            default:
                throw new Error('Invalid Data');
        }
    }

    
});

export default router;
