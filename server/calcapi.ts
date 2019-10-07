import express from 'express';
import execCalc from './calculator/execCalc';
import exprMap from './calculator/exprMap';
import { Matrix, Vector, RandomMatrix, gaussianElimination } from './calculator/models';
import shuntingYard from './calculator/shuntingYard';
import questions from './questions';
import { IQuestionOptions, TCalc, TQuestion } from './types';

function joinRegex(...regex: RegExp[]): RegExp {
    return new RegExp(regex.map(item => item.source).join('|'), 'gi');
}

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    const NUMBER_REGEX: RegExp = /(-1|[\d\.]+)/;
    const EXPR_REGEX: RegExp = /[a-z*+\-/\^]+/i;
    const MATRIX_REGEX: RegExp = /\[(\[(-?[\d\.]+,?)+\],?)+\]/;
    // same as matrix but with only 1 inner array
    const VECTOR_REGEX: RegExp = /\[(\[-?\d+,?\],?)+\]/;
    const BRACKET_REGEX: RegExp = /[\(\)]/;

    let { query: {calc: body} } = req;

    if (!body && typeof(body) !== 'string') return res.status(400);

    let partsArr: string[] | null = body
        .replace(new RegExp('-(\\(?' + joinRegex(/(-1|\+?[\d\.]+)/, MATRIX_REGEX).source + ')', 'g'), '+(-1*$1)')
        .replace(/(^\+)|(?<=\(|\^)\+|\s/g, '')
        .replace(/([\d\]\)])([\(\[])/g, '$1*$2')
        .match(joinRegex(
            NUMBER_REGEX,
            EXPR_REGEX,
            MATRIX_REGEX,
            BRACKET_REGEX
        ));

    if (!partsArr) return res.sendStatus(400);

    try {
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
            } else if (item.match(NUMBER_REGEX)) {
                return {
                    type: 'no',
                    data: +item
                };
            } else if (item.match(EXPR_REGEX)) {
                if (!Object.keys(exprMap).includes(item)) throw new Error('invalid expr');
                return {
                    type: 'expr',
                    data: exprMap[item]
                };
            } else {
                return {
                    type: 'bracket',
                    data: item
                };
            }
        });

        let postFix: TCalc[] = shuntingYard(calc);
        let result: any[] = execCalc(postFix).map(result => {
            return {
                type: result.type,
                data: result.data.toString()
            };
        });

        res.status(200).json(result);
    } catch (ex) {
        console.log(ex.message);
        res.status(400).json({message: ex.message});
    }
});

router.get('/question/:type', (req, res) => {
    let { query: qTemp, params: {type} } = req;

    if (type === '') return res.sendStatus(400);

    let query: IQuestionOptions = qTemp;

    let question: TQuestion | undefined = questions[type];
    if (question) {
        return res.json(new question(query));
    } else {
        return res.sendStatus(400);
    }
});

router.get('/404', (req, res) => {
    let matrix: Matrix;
    let four0four = new Vector([4, 0, 4]);
    let result: number[] = [];

    do {
        matrix = new RandomMatrix(3, 3, 10);
        try {
            result = gaussianElimination(
                new Matrix(matrix.transposed().getArr().concat([four0four.getArr()])
            ).transposed().getArr());
        } catch (ex) {
            continue;
        }
    } while (result.length === 0);

    res.status(200).json([
        {
            type: 'matrix',
            data: matrix.toString()
        },
        {
            type: 'matrix',
            data: new Vector(result).toString()
        },
        {
            type: 'matrix',
            data: four0four.toString()
        }
    ]);
});

router.get('/coffee', (req, res) => {
    res.status(418).send('I cannot brew coffee, I\'m a teapot!');
});

export default router;
