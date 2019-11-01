import { Matrix, RandomMatrix } from '../calculator/models';
import { IAnswer, IQuestion, IQuestionOptions } from '../types';

export default class MatrixMult implements IQuestion {
    public question: string;
    public answers: IAnswer[];

    constructor(options: IQuestionOptions) {
        const noRows: string = options.noRows || '3';
        const noCols: string = options.noCols || '3';
        const maxNo: string = options.maxNo || '10';
        const ints: string = options.ints || 'true';

        console.log([noRows, noCols, maxNo, ints]);

        let matrices: Matrix[] = new Array(2).fill([]).map(() => new RandomMatrix(
            parseInt(noRows, 10), parseInt(noCols, 10), parseInt(maxNo, 10), ints === 'true' ? 0 : 1)
        );

        let result: Matrix = matrices[0].multiply(matrices[1]);

        this.question = `$$${matrices.map(matrix => matrix.toLatex()).join(' ')}=$$`;
        this.answers = [ {
            label: '',
            value: result.toString()
        } ];
    }
}
