import { Matrix, QR, QR_Result, RandomMatrix } from '../calculator/models';
import { IAnswer, IQuestion, IQuestionOptions } from '../types';

export default class Eigen implements IQuestion {
    public question: string;
    public answers: IAnswer[];

    constructor(options: IQuestionOptions) {
        const noRows: number = options.noRows || 2;
        const noCols: number = options.noCols || 2;
        const maxNo: number = options.maxNo || 10;
        const ints: boolean = options.ints || true;
        const eigenvalues: boolean = options.eigenvalues || true;
        const eigenvectors: boolean = options.eigenvectors || true;

        console.log('start');
        let matrix: Matrix;
        let results: QR_Result[];

        while (true) {
            // We need a non-0 matrix to get its eigenthings
            matrix = new RandomMatrix(noRows, noCols, maxNo, ints ? 0 : 2);

            try {
                results = QR(matrix);
            } catch (ex) {
                console.log(ex.message);
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
                value: result.eigenvector.toString()
            });
        }

    }
}
