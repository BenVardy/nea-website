import Matrix from '../classes/matrix';
import Vector from '../classes/vector';
import ZeroVector from '../classes/vectors/zeroVector';

/**
 * Projects a vector from its current state to the next state
 * @param u The vector to project
 * @param v The reference vector
 */
function project(u: Vector, v: Vector): Vector {
    if (u.equals(new ZeroVector(u.getDim()))) return new ZeroVector(u.getDim());

    let frac: number = v.dotMultiply(u) / u.dotMultiply(u);
    return u.multiply(frac);
}

/**
 * Uses the Gram-Schmidt process to find an
 * orthogonal matrix of the matrix provided
 * @param v The matrix to perform on
 */
export default function gramSchmidt(v: Matrix): Matrix {
    let u: Vector[] = [];
    for (let i = 0; i < v.getDim(1); i++) {
        u.push(new Vector(v.getCol(i)));
    }

    u[0] = u[0].asUnit();
    for (let i = 1; i < u.length; i++) {
        for (let j = 0; j < i; j++) {
            u[i] = u[i].subtract(project(u[j], u[i]));
        }

        u[i] = u[i].asUnit();
    }

    let finalMatArr: number[][] = u.map(vect => vect.getArr());
    return new Matrix(finalMatArr).transposed();
}
