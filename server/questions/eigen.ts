import { Matrix, QR, QR_Result, RandomMatrix } from '../calculator/models';
import { IAnswer, IQuestion, IQuestionOptions } from '../types';

export default class Eigen implements IQuestion {
    public question: string;
    public answers: IAnswer[];

    constructor(options: IQuestionOptions) {
        const noRows: string = options.noRows || '2';
        // Columns should be the same as rows to ensure square matrices
        const noCols: string = noRows;
        const maxNo: string = options.maxNo || '10';
        const ints: string = options.ints || 'true';
        const eigenvalues: string = options.eigenvalues || 'true';
        const eigenvectors: string = options.eigenvectors || 'true';

        let matrix: Matrix;
        let results: QR_Result[];

        while (true) {
            // We need a non-0 matrix to get its eigenthings
            matrix = new RandomMatrix(
                parseInt(noRows, 10), parseInt(noCols, 10), parseInt(maxNo, 10), ints === 'true' ? 0 : 1
            );

            try {
                results = QR(matrix);
            } catch (ex) {
                continue;
            }
            break;
        }

        let questionString: string = eigenvalues && eigenvectors ? 'eigenvalues and eigenvectors'
                                                   : eigenvalues ? 'eigenvalues'
                                                   : eigenvectors ? 'eigenvectors' : '';

        this.question = `Find the ${questionString} of the matrix. $$${matrix.toLatex()}$$`;

        this.answers = [];
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            this.answers.push({
                label: `eigenvalue${i}`,
                value: result.eigenvalue.toString()
            });

            this.answers.push({
                label: `eigenvector${i}`,
                value: new Matrix(result.eigenvector.getArr().map(row => [row])).toString()
            });
        }

    }
}
