import Matrix from './matrix';

/**
 * A vector
 */
export default class Vector {
    /**
     * Tests if an object is a vector
     * @param object The object to test
     */
    public static isVector(object: any): object is Vector {
        return (object as Vector).dotMultiply !== undefined;
    }

    // Properties
    private dimension: number;
    private arr: number[];

    // Methods
    /**
     * Sets up a new vector with the array provided
     * @param arr The array to populate the vector with
     */
    public constructor(arr: number[]) {
        this.dimension = arr.length;
        this.arr = arr;
    }

    /**
     * Gets the value at the index provided
     * (indexed at 0)
     * @param index The index from the top
     */
    public _(index: number): number {
        return this.arr[index];
    }

    /**
     * Performs dot multiplication on the vectors
     * @param v The vector to multiply by
     */
    public dotMultiply(v: Vector): number {
        if (v.getDim() !== this.dimension) {
            throw new Error('Vectors must be of the same dimension');
        }
        return this.arr.reduce((acc, val, i) => acc += val * v._(i), 0);
    }
    /**
     * Performs matrix multiplication between the vector and the matrix
     * @param matrix The matrix to multiply by
     */
    public multiply(matrix: Matrix): Matrix;
    /**
     * Scales the vector by a linear factor
     * @param n The linear factor to scale by
     */
    public multiply(n: number): Vector;
    public multiply(object: (Matrix|number)): (Matrix|Vector) {
        if (typeof(object) === 'number') {
            return new Vector(this.arr.map(val => val * object));
        } else {
            let output: number[][] = [];
            for (let i = 0; i < this.getDim(); i++) {
                let topAdd: number[] = [];
                for (let j = 0; j < object.getDim(1); j++) {
                    topAdd.push(this._(i) * object._(i, j));
                }
            }

            return new Matrix(output);
        }
    }

    /**
     * Performs vector addition
     * @param v The vector to add
     */
    public add(v: Vector): Vector {
        return new Vector(this.arr.map((val, i) => val + v._(i)));
    }
    /**
     * Performs vector subtraction
     * @param v The vector to subtract
     */
    public subtract(v: Vector): Vector {
        return this.add(v.multiply(-1));
    }

    /**
     * Returns the size of the vector
     */
    public length(): number {
        return Math.sqrt(this.arr.reduce((acc, val) => acc += val * val, 0));
    }
    /**
     * Returns the vector as a unit vector
     */
    public asUnit(): Vector {
        let len: number = this.length();
        return new Vector(this.arr.map(val => val / len));
    }

    /**
     * Converts a vector to a LaTeX string
     */
    public toLatex(): string {
        return `\\begin{bmatrix}${this.getRoundedArr().join('\\\\')}\\end{bmatrix}`;
    }
    /**
     * Converts a matrix to a string for console
     */
    public toString(): string {
        return `[ [ ${this.getRoundedArr().join(' ], [ ')} ] ]`;
    }
    /**
     * Returns the dimension of the vector
     */
    public getDim(): number {
        return this.dimension;
    }
    /**
     * Returns the vector as an array
     */
    public getArr(): number[] {
        return this.arr;
    }

    /**
     * Tests if an object is equal to the vector
     * @param object The object to test
     */
    public equals(object: any): boolean {
        if (Vector.isVector(object)) {
            if (this.getDim() !== object.getDim()) return false;

            return this.arr.every((val, i) => val === object._(i));
        } else if (Matrix.isMatrix(object)) {
            return object.equals(this);
        } else {
            return false;
        }
    }

    /**
     * Tests if a vector is similar to this vector
     * @param vector The vector to test
     */
    public similar(vector: Vector): boolean {
        if (this.equals(vector)) return true;

        if (this.getDim() !== vector.getDim()) return false;

        let factor: number = vector._(0) / this._(0);
        return this.arr.every((val, i) => val * factor === vector._(i));
    }

    /**
     * Returns a new Vector rounded to n decimal places
     * @param n The number of decimal places (3 if not provided)
     */
    public roundTo(n?: number): Vector {
        if (!n) n = 3;

        return new Vector(this.getRoundedArr(n));
    }

    /**
     * Returns the inner array of the vector rounded to n decimal places
     * @param n The number of decimal places
     */
    private getRoundedArr(n?: number): number[] {
        if (!n) n = 3;

        let decFactor: number = Math.pow(10, n);
        return this.arr.map(val => Math.round(val * decFactor) / decFactor);
    }
}
