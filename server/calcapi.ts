import express from 'express';
import execCalc from './calculator/execCalc';
import { gaussianElimination, Matrix, RandomMatrix, Vector } from './calculator/models';
import shuntingYard from './calculator/shuntingYard';
import parseInput from './parseInput';
import questions from './questions';
import { IQuestion, IQuestionOptions, TCalc, TQuestion } from './types';

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {

    let { query: {calc: body} } = req;
    if (!body && typeof(body) !== 'string') return res.status(400);

    try {
        let calc: TCalc[] = parseInput(body);

        let postFix: TCalc[] = shuntingYard(calc);
        let result: any[] = execCalc(postFix).map(result => {
            return {
                type: result.type,
                data: result.data.toString()
            };
        });

        res.status(200).json(result);
    } catch (ex) {
        console.log(ex);
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
