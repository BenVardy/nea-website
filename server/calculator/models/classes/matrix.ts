import Vector from './vector';

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
    public constructor(arr: number[][]) {
        this.arr = arr;
        this.dimensions = [arr.length, arr[0].length];
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
        for (let i = 0; i < this.getDim(1); i++) {
            let newMatArr: number[][] = this.arr.slice(1).map(row => {
                let newRow = row.slice();
                newRow.splice(i, 1);
                return newRow;
            });

            let newMat: Matrix = new Matrix(newMatArr);

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
            let objDim: number = Vector.isVector(object) ? object.getDim() : object.getDim(0);

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
                        sum += this._(i, k) * (Vector.isVector(object) ? object._(j) : object._(k, j));
                    }
                    toAdd.push(sum);
                }
                output.push(toAdd);
            }

            if (Vector.isVector(object)) return new Vector(output[0]);
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
        return `\\begin{bmatrix}${this.getRoundArr().map(row => row.join('&&')).join('\\\\')}\\end{bmatrix}`;
    }
    /**
     * Converts a matrix to a string for console
     */
    public toString(): string {
        let tempArr = this.getRoundArr();
        return `[ [ ${tempArr.map(row => row.join(', ')).join(']\n  [')} ] ]`;
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
}
