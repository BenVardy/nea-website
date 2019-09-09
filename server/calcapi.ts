import express from 'express';
import exprMap from './calculator/exprMap';
import { Matrix, Vector } from './calculator/models';
import shuntingYard from './calculator/models/scripts/shuntingYard';
import { TCalc } from './types';

function joinRegex(...regex: RegExp[]): RegExp {
    return new RegExp(regex.map(item => item.source).join('|'), 'gi');
}

const router = express.Router();

router.use(express.json());

router.post('/', (req, res) => {
    const NUMBER_REGEX: RegExp = /\d+/;
    const EXPR_REGEX: RegExp = /[a-z*+\-/\^]+/i;
    const MATRIX_REGEX: RegExp = /\[(\[(\d+,?)+\],?)+\]/;
    const BRACKET_REGEX: RegExp = /[\(\)]/;

    let { body } = req;

    if (!body.data && typeof(body.data) !== 'string') return res.status(400);

    let partsArr: string[] = body.data.replace(/\s/g, '').replace(/([\d\]\)])([\(\[])/g, '$1*$2').match(joinRegex(
        NUMBER_REGEX,
        EXPR_REGEX,
        MATRIX_REGEX,
        BRACKET_REGEX
    ));

    let calc: TCalc[] = partsArr.map(item => {
        if (item.match(MATRIX_REGEX)) {
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

    console.log(shuntingYard(calc));

    res.sendStatus(200);

});

export default router;
