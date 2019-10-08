import { Matrix, RandomMatrix, QR } from '../calculator/models';
import { IAnswer, IQuestion, IQuestionOptions } from '../types';

export default class MatrixAdd implements IQuestion {
    public question: string;
    public answers: IAnswer[];

    constructor(options: IQuestionOptions) {
        const noRows: number = options.noRows || 3;
        const noCols: number = options.noCols || 3;
        const maxNo: number = options.maxNo || 10;
        const ints: boolean = options.ints || true;
        const eigenvalues: boolean = options.eigenvalues || true;
        const eigenvectors: boolean = options.eigenvectors || true;

        let matrix: Matrix;
        do {
            // We need a non-0 matrix to get its eigenthings
            matrix = new RandomMatrix(noRows, noCols, maxNo);
        } while (matrix.getDet() === 0);

        let results = QR(matrix);

        let questionString: string = eigenvalues && eigenvectors ? 'eigenvalues and eigenvectors'
                                                   : eigenvalues ? 'eigenvalues'
                                                   : eigenvectors ? 'eigenvectors' : '';

        this.question = `Find the ${questionString} of the matrix. ${matrix.toLatex()}`;

        this.answers = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            this.answers.push({
                label: `eigenvalue${i}`,
                value: result.eigenvalue.toString()
            });

            this.answers.push({
                label: `eigenvector${i}`,
                value: result.eigenvector.toString()
            });
        }
    }
}
