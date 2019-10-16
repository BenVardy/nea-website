import gaussianElimination from './gaussian-elimination';
import gramSchmidt from './GramSchmidtProcess';

import Matrix from '../classes/matrix';
import Vector from '../classes/vector';
import ZeroVector from '../classes/vectors/zeroVector';

/**
 * Finds the eigenvectors given a matrix and an eigenvalue
 * @param matrix The matrix
 * @param lambda The eigenvalue
 */
function findEigenvectors(matrix: Matrix, lambda: number): Vector {
    for (let k = 0; k < matrix.getDim(0); k++) {
        let tempSimMat: number[][] = [];
        for (let i = 0; i < matrix.getDim(0); i++) {
            let toAdd: number[] = [];
            for (let j = 0; j < matrix.getDim(0); j++) {
                toAdd.push(((i === j) ? -lambda : 0) + matrix._(i, j));
            }
            toAdd.push(-toAdd[k]);
            toAdd.splice(k, 1);
            tempSimMat.push(toAdd);
        }

        let simMat: number[][] = [];
        for (let eq of tempSimMat) {
            if (simMat.length === matrix.getDim(0) - 1) break;
            if (eq.some(val => Math.round(val * 10000) / 10000 !== 0)) {
                simMat.push(eq);
            }
        }

        if (simMat.length === 0) continue;

        let output: number[] = [];
        try {
            output = gaussianElimination(simMat);
        } catch (ex) {
            continue;
        }

        output.splice(k, 0, 1);
        return new Vector(output).asUnit();
    }

    return new ZeroVector(matrix.getDim(0));
}

/**
 * Results from the QR algorithm
 */
// tslint:disable: class-name
// tslint:disable-next-line: interface-name
export interface QR_Result {
// tslint:enable: class-name
    eigenvalue: number;
    eigenvector: Vector;
}

/**
 * Finds the eigenvalues and the eigenvectors of a given matrix
 * @param a The matrix to operate on
 */
export function QR(a: Matrix): QR_Result[] {
    let detA: number = a.getDet();
    if (detA === 0) throw Error('Only works on invertible matrices');

    let ak: Matrix = a.clone();
    let q: Matrix;
    let r: Matrix;

    let eigenvalues: number[] = [];

    if (Math.pow(a.getDet(), 2) === 1 && a.isSymmetric()) {
        q = gramSchmidt(ak);
        r = q.transposed().multiply(ak);

        for (let i = 0; i < ak.getDim(0); i++) {
            eigenvalues.push((ak._(i, i) < 0 ? -1 : 1) * r._(i, i));
        }
    } else {
        let j: number = 0;
        do {
            q = gramSchmidt(ak);
            r = q.transposed().multiply(ak);
            ak = r.multiply(q);
            j++;
            if (j > 10000) {
                throw Error('Has imaginary eigenvalues');
            }
        } while (Math.round((ak.diagProduct() - detA) * 100000000000) !== 0);

        // console.log(`Iterations=${j}`);
        for (let i = 0; i < ak.getDim(0); i++) {
            eigenvalues.push(ak._(i, i));
        }
    }

    eigenvalues.sort((a, b) => a - b);

    let results: QR_Result[] = eigenvalues.map(eigenvalue => ({
        // Round the eigenvalues to 3dp
        eigenvalue: Math.round(eigenvalue * 1000) / 1000,
        eigenvector: findEigenvectors(a, eigenvalue)
    }));

    return results;
}
