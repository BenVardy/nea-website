import { gaussianElimination, Matrix, RandomMatrix, Vector } from '../calculator/models';

export default async function Four0Four(): Promise<any> {
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

    return [
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
    ];
}
