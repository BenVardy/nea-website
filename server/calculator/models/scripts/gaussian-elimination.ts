import Matrix from '../classes/matrix';

/**
 * Solves simulations equations using Gaussian elimination
 * @param eqs A 2d array of the equations
 */
export default function gaussianElimination(eqs: number[][]): number[] {
    let matrix: Matrix = new Matrix(eqs);

    if (matrix.getDim(0) + 1 !== matrix.getDim(1)) throw Error('Matrix must be order nx(n+1)');

    for (let i = 0; i < matrix.getDim(0); i++) {
        for (let j = i + 1; j < matrix.getDim(0); j++) {
            let r1: number[] = matrix.getRow(i).slice(0, matrix.getDim(1) - 1);
            let r2: number[] = matrix.getRow(j).slice(0, matrix.getDim(1) - 1);

            let scale: number = Math.round((r1[0] / r2[0]) * 100000);
            if (r1.every((val, k) => Math.round((val / r2[k]) * 100000) === scale)) {
                throw Error('Equations are parallel');
            }
        }
    }

    if (matrix.getDim(0) === 1) {
        if (matrix._(0, 0) === 0) throw Error('Equations are parallel');
        matrix = matrix.reduceRowToOne(0);
        return matrix.getCol(1);
    }

    for (let i = 0; i < matrix.getDim(0) - 1; i++) {
        if (matrix._(i, i) === 0) throw new Error('Equations are parallel');
        matrix = matrix.reduceRowToOne(i);
        for (let j = i + 1; j < matrix.getDim(0); j++) {
            matrix = matrix.CancelRowAtBy(i, j, i);
        }
    }

    for (let i = matrix.getDim(0) - 1; i > 0; i--) {
        if (matrix._(i, i) === 0) throw new Error('Equations are parallel');
        matrix = matrix.reduceRowToOne(i);
        for (let j = 0; j < i; j++) {
            matrix = matrix.CancelRowAtBy(i, j, i);
        }
    }

    return matrix.getCol(matrix.getDim(1) - 1);
}
