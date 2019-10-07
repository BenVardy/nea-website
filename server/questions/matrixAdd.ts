import { Matrix, RandomMatrix } from '../calculator/models';
import { IAnswer, IQuestion, IQuestionOptions } from '../types';

export default class MatrixAdd implements IQuestion {
    public question: string;
    public answers: IAnswer[];

    constructor(options: IQuestionOptions) {
        const noRows: number = options.noRows || 3;
        const noCols: number = options.noCols || 3;
        const maxNo: number = options.maxNo || 10;
        const ints: boolean = options.ints || true;

        let matrices: Matrix[] = new Array(2).fill([]).map(() => new RandomMatrix(noRows, noCols, maxNo, ints ? 0 : 1));

        let result: Matrix = matrices[0].add(matrices[1]);

        this.question = matrices.map(matrix => matrix.toLatex()).join('+') + '=';
        this.answers = [{
            label: '',
            value: result.toString()
        }];
    }
}
