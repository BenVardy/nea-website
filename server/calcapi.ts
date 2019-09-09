import express from 'express';
import execCalc from './calculator/execCalc';
import exprMap from './calculator/exprMap';
import { Matrix, Vector } from './calculator/models';
import shuntingYard from './calculator/shuntingYard';
import { TCalc } from './types';

function joinRegex(...regex: RegExp[]): RegExp {
    return new RegExp(regex.map(item => item.source).join('|'), 'gi');
}

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    const NUMBER_REGEX: RegExp = /[\d\.]+/;
    const EXPR_REGEX: RegExp = /[a-z*+\-/\^]+/i;
    const MATRIX_REGEX: RegExp = /\[(\[([\d\.]+,?)+\],?)+\]/;
    // same as matrix but with only 1 inner array
    const VECTOR_REGEX: RegExp = /\[(\[\d+,?\],?)+\]/;
    const BRACKET_REGEX: RegExp = /[\(\)]/;

    let { query: {calc: body} } = req;

    if (!body && typeof(body) !== 'string') return res.status(400);

    let partsArr: string[] | null = body.replace(/[\s]/g, '').replace(/([\d\]\)])([\(\[])/g, '$1*$2').match(joinRegex(
        NUMBER_REGEX,
        EXPR_REGEX,
        MATRIX_REGEX,
        BRACKET_REGEX
    ));

    if (!partsArr) return res.sendStatus(400);

    let calc: TCalc[] = partsArr.map(item => {
        if (item.match(VECTOR_REGEX)) {
            return {
                type: 'vector',
                // Regex means that there will only be 1 inner array
                data: new Vector(JSON.parse(item).map((row: number[]) => row[0]))
            };
        } else if (item.match(MATRIX_REGEX)) {
            return {
                type: 'matrix',
                data: new Matrix(JSON.parse(item))
            };
        } else if (item.match(EXPR_REGEX)) {
            if (!Object.keys(exprMap).includes(item)) throw new Error('invalid expr');
            return {
                type: 'expr',
                data: exprMap[item]
            };
        } else if (item.match(NUMBER_REGEX)) {
            return {
                type: 'no',
                data: +item
            };
        } else {
            return {
                type: 'bracket',
                data: item
            };
        }
    });

    let postFix: TCalc[] = shuntingYard(calc);
    console.log(execCalc(postFix));

    res.sendStatus(200);

});

export default router;
