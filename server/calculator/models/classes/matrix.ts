import { QR, QR_Result, Vector, ZeroMatrix } from '..';

/**
 * A matrix
 */
export default class Matrix {
    /**
     * Tests if an object is a matrix
     * @param object The object to test
     */
    public static isMatrix(object: any): object is Matrix {
        return (object as Matrix).getDet !== undefined;
    }

    // Properties
    private dimensions: number[];

    /**
     * The matrix arr is indexed (row, col) or (y, x) from 0
     */
    private arr: number[][];

    // Methods
    /**
     * Sets up a new matrix with the array provided
     * @param arr The array to populate the matrix with
     */
    public constructor(arr: number[][]);
    /**
     * @param arr The columns of the matrix as vectors
     */
    public constructor(arr: Vector[]);
    public constructor(arr: number[][]|Vector[]) {
        // If the 1st element is a vector then it must be a Vector[]
        if (Vector.isVector(arr[0])) {
            let tempArr: number[][] = (arr as Vector[]).map(vect => vect.getArr());
            // Should prob change this in the future
            this.arr = new Matrix(tempArr).transposed().getArr();
            this.dimensions = [tempArr[0].length, tempArr.length];
        } else {
            let numArr: number[][] = (arr as number[][]);
            this.arr = numArr;
            this.dimensions = [numArr.length, numArr[0].length];
        }
    }

    //#region Getters
    /**
     * Gets the value at position i, j
     * (indexed at 0)
     * @param i The row
     * @param j The column
     */
    public _(i: number, j: number): number {
        return this.arr[i][j];
    }

    /**
     * Gets a row from the matrix
     * (indexed at 0)
     * @param i The index of the row
     */
    public getRow(i: number): number[] {
        return this.arr[i];
    }

    /**
     * Gets a column from the matrix
     * (indexed at 0)
     * @param i The index of the column
     */
    public getCol(i: number): number[] {
        return this.transposed().getRow(i);
    }

    /**
     * Gets the size of the nth dimension of the array
     * @param n The dimension
     */
    public getDim(n: number): number {
        if (n >= this.dimensions.length) throw Error('Invalid Dimension');

        return this.dimensions[n];
    }

    /**
     * Returns the determinate of the matrix if the matrix is square
     */
    public getDet(): number {
        if (this.getDim(0) !== this.getDim(1)) throw Error('must be square matrix');

        if (this.getDim(0) === 1) return this._(0, 0);

        let total: number = 0;
        // i is the column
        for (let i = 0; i < this.getDim(1); i++) {
            let newMat: Matrix = this.getMinorMatrix(0, i);

            total += Math.pow(-1, i) * this._(0, i) * newMat.getDet();
        }

        return total;
    }
    //#endregion

    //#region Maths functions
    /**
     * Performs matrix multiplication
     * @param matrix The matrix to multiply by
     */
    public multiply(matrix: Matrix): Matrix;
    /**
     * Performs matrix multiplication
     * @param vector The vector to multiply by
     */
    public multiply(vector: Vector): Vector;
    /**
     * Scales the matrix by n
     * @param n The linear factor to multiply by
     */
    public multiply(n: number): Matrix;
    public multiply(object: (Matrix|Vector|number)): (Matrix|Vector) {
        let output: number[][] = [];
        if (typeof(object) === 'number') {
            for (let i = 0; i < this.getDim(0); i++) {
                let toAdd: number[] = [];
                for (let j = 0; j < this.getDim(1); j++) {
                    toAdd.push(this._(i, j) * object);
                }
                output.push(toAdd);
            }

            return new Matrix(output);
        } else {
            let objDim: number = Vector.isVector(object) ? 1 : object.getDim(1);

            // Check if the dimensions are mxn and nxk
            if (Vector.isVector(object) && this.getDim(1) !== object.getDim()) {
                throw new Error('Invalid matrix dimensions');
            } else if (this.getDim(1) !== object.getDim(0)) {
                throw new Error('Invalid matrix dimensions');
            }

            for (let i = 0; i < this.getDim(0); i++) {
                let toAdd: number[] = [];
                for (let j = 0; j < objDim; j++) {
                    let sum: number = 0;
                    for (let k = 0; k < this.getDim(1); k++) {
                        sum += this._(i, k) * (Vector.isVector(object) ? object._(k) : object._(k, j));
                    }
                    toAdd.push(sum);
                }
                output.push(toAdd);
            }

            if (Vector.isVector(object)) return new Vector(output.map(row => row[0]));
            else return new Matrix(output);
        }
    }

    /**
     * Performs matrix addition
     * @param matrix The matrix to add by
     */
    public add(matrix: Matrix): Matrix {
        if (this.getDim(0) !== matrix.getDim(0) || this.getDim(1) !== matrix.getDim(1)) {
            throw new Error('Matrices must be of same dimensions');
        }

        return new Matrix(this.arr.map((row, i) => (
            row.map((val, j) => val + matrix._(i, j))
        )));
    }
    /**
     * Performs matrix subtraction
     * @param matrix The matrix to subtract by
     */
    public subtract(matrix: Matrix): Matrix {
        return this.add(matrix.multiply(-1));
    }
    //#endregion

    /**
     * Returns the a transposed copy of the matrix\
     * (Switches all the x's and the y's)
     */
    public transposed(): Matrix {
        let output: number[][] = [];

        for (let j = 0; j < this.getDim(1); j++) {
            let temp: number[] = [];
            for (let i = 0; i < this.getDim(0); i++) {
                temp.push(this._(i, j));
            }
            output.push(temp);
        }

        return new Matrix(output);
    }

    /**
     * Returns the product of the values in the main diagonal
     */
    public diagProduct(): number {
        if (this.getDim(0) !== this.getDim(1)) throw Error('must be square');

        let total: number = 1;
        for (let i = 0; i < this.getDim(0); i++) {
            total *= this._(i, i);
        }

        return total;
    }

    /**
     * Returns the inverse of a non-0 matrix
     */
    public invert(diagonalize: boolean): Matrix {
        if (this.getDet() === 0) throw Error('Can\'t invert matrix. det = 0');

        if (diagonalize && this.isSquareMatrix()) {
            // PInv is the inverse of P
            const [P, D, PInv] = this.diagonalize();

            let diagonalArr: number[][] = D.getArr();
            for (let i = 0; i < D.getDim(0); i++) {
                diagonalArr[i][i] = Math.pow(D._(i, i), -1);
            }

            return P.multiply(new Matrix(diagonalArr)).multiply(PInv);
        } else {
            let innerArr: number[][] = [];
            for (let i = 0; i < this.getDim(0); i++) {
                let row: number[] = [];
                for (let j = 0; j < this.getDim(1); j++) {
                    let minorMatrix: Matrix = this.getMinorMatrix(i, j);
                    row.push(Math.pow(-1, i + j) * minorMatrix.getDet());
                }
                innerArr.push(row);
            }

            return new Matrix(innerArr).multiply(1 / this.getDet()).transposed();
        }
    }

    /**
     * Outputs a matrix in diagonal form
     */
    public diagonalize(): Matrix[] {
        let eigen: QR_Result[] = QR(this);

        let eigenvalues: number[] = [];
        let eigenvectors: Vector[] = [];
        for (let pair of eigen) {
            eigenvalues.push(pair.eigenvalue);
            eigenvectors.push(pair.eigenvector);
        }

        let diag: number[][] = new ZeroMatrix(this.getDim(0)).getArr();
        for (let i = 0; i < this.getDim(0); i++) {
            diag[i][i] = eigenvalues[i];
        }

        let p: Matrix = new Matrix(eigenvectors);

        return [p, new Matrix(diag), p.invert(false)];
    }

    //#region Row operations
    /**
     * Returns an array with the indexed diagonal
     * reduced to one and the corresponding row reduced
     * @param diagPos The index on the diagonal
     */
    public reduceRowToOne(diagPos: number): Matrix {
        let modifier: number = this._(diagPos, diagPos);
        let arr: number[][] = this.getArr();

        arr[diagPos] = arr[diagPos].map(val => val / modifier);

        return new Matrix(arr);
    }

    /**
     * 0s out a value in a row by subtracting one row from another
     * @param s The source row
     * @param d The destination row
     * @param x The column position to 0 out
     */
    public CancelRowAtBy(s: number, d: number, x: number): Matrix {
        let modifier: number = this._(d, x) / this._(s, x);
        let arr: number[][] = this.getArr();

        arr[d] = arr[d].map((val, i) => val - modifier * this._(s, i));

        return new Matrix(arr);
    }
    //#endregion

    //#region Boolean tests
    /**
     * Tests if the matrix is symmetric along the main diagonal
     */
    public isSymmetric(): boolean {
        return this.equals(this.transposed());
    }

    /**
     * Tests if a matrix is square
     */
    public isSquareMatrix(): boolean {
        return this.getDim(0) === this.getDim(1);
    }

    /**
     * Tests if an object is equal to the matrix
     * @param object The object to test
     */
    public equals(object: any): boolean {
        if (Vector.isVector(object)) {
            if (this.getDim(1) !== 1 || this.getDim(0) !== object.getDim()) return false;

            return this.getCol(0).every((val, i) => val === object._(i));
        } else if (Matrix.isMatrix(object)) {
            if (this.getDim(0) !== object.getDim(0) || this.getDim(1) !== object.getDim(1)) return false;

            return this.arr.every((row, y) => row.every((val, x) => val === object._(y, x)));
        } else {
            return false;
        }
    }
    //#endregion

    //#region Outputs
    /**
     * Returns the inner array of the matrix
     */
    public getArr(): number[][] {
        return this.arr.map(row => row.slice()).slice();
    }

    /**
     * Clones the matrix
     */
    public clone(): Matrix {
        return new Matrix(this.arr.map(row => row.slice()).slice());
    }

    /**
     * Returns a new Matrix rounded to n decimal places
     * @param n The number of decimal places (3 if not provided)
     */
    public roundTo(n?: number): Matrix {
        if (!n) n = 3;

        return new Matrix(this.getRoundArr(n));
    }

    /**
     * Converts a matrix to a LaTeX string
     */
    public toLatex(): string {
        return `\\begin{bmatrix}${this.getRoundArr().map(row => row.join('&')).join('\\\\')}\\end{bmatrix}`;
    }
    /**
     * Converts a matrix to a string for console
     */
    public toString(): string {
        let tempArr = this.getRoundArr();
        return `[[${tempArr.map(row => row.join(',')).join('],[')}]]`;
    }
    //#endregion

    /**
     * Returns the inner array of the matrix rounded to n decimal places
     * @param n The number of decimal places
     */
    private getRoundArr(n?: number): number[][] {
        if (!n) n = 3;

        let decFactor: number = Math.pow(10, n);
        return this.arr.map(row => row.map(val => Math.round(val * decFactor) / decFactor));
    }

    /**
     * Gets the matrix when the row i and column j is removed
     * @param i The row to remove
     * @param j The column to remove
     */
    private getMinorMatrix(i: number, j: number): Matrix {
        let temp: number[][] = this.getArr();
        temp.splice(i, 1);

        return new Matrix(temp.map(row => {
            let newRow = row.slice();
            newRow.splice(j, 1);
            return newRow;
        }));
    }
}
