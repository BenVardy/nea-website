import { ISymbolData } from '../types';

export default class InputMatrix implements ISymbolData {

    // Static Methods
    /**
     * Tests if an object is an InputMatrix
     * @param o The thing to test
     */
    public static isInputMatrix(o: any): o is InputMatrix {
        return (o as InputMatrix).addChar !== undefined;
    }

    // Properties

    private arr: string[][];
    private dims: number[];

    // The current row and column
    private i: number = 0;
    private j: number = 0;

    // Methods
    constructor();
    constructor(arr: string[][]);
    public constructor(arr?: string[][]) {
        if (!arr) arr = [ [ '' ] ];
        this.arr = arr;

        let LargestDim: number = arr.reduce((p, c, i, a) => a[p].length > c.length ? p : i, 0);
        this.dims = [arr.length, arr[LargestDim].length]
    }


    //#region Matrix things
    /**
     * Gets the value at position [i, j]
     * @param i The row
     * @param j The column
     */
    public _(i: number, j: number): string {
        return this.arr[i][j];
    }
    
    /**
     * Gets the size of the dimension
     * @param n The dimension
     */
    public getDim(n: number): number {
        return this.dims[n];
    }

    /**
     * Transposes the matrix
     */
    public transposed(): InputMatrix {
        let newMatArr: string[][] = [];
        for (let j = 0; j < this.getDim(1); j++) {
            let currentRow: string[] = [];
            for (let i = 0; i < this.getDim(0); i++) {
                currentRow.push(this._(i, j));
            }
            newMatArr.push(currentRow);
        }

        return new InputMatrix(newMatArr);
    }

    /**
     * Outputs the latex representation of the matrix
     * 
     * @param cursor Whether to display a cursor at the current position or not
     */
    public toLatex(cursor: boolean): string {
        let temp: string[][] = this.getArr();
        if (cursor) temp[this.i][this.j] += '|';

        let replaceBlanks: (item: string) => string = item => item.replace(/^$/, '\\cdot');

        return `
            \\begin{bmatrix}
                ${temp.map(row => row.map(replaceBlanks).join(' & ')).join(' \\\\ ')}
            \\end{bmatrix}
        `;
    }
    
    /**
     * Returns the string representation of the matrix
     * Does not keep information about location in matrix
     */
    public extract(): string[][] {
        return this.getArr();
    }

    /**
     * Returns the array of the matrix
     */
    public getArr(): string[][] {
        return this.arr.map(row => row.slice()).slice();
    }
    //#endregion

    //#region Input things
    
    /**
     * Adds the character at the current position
     * @param c The char
     */
    public addChar(c: string): void {
        this.arr[this.i][this.j] += c;
    }

    /**
     * Removes the right-most char at the current position
     */
    public deleteChar(): void {
        let { i, j } = this;

        this.arr[i][j] = this.arr[i][j].slice(0, -1);
    }

    /**
     * Moves the cursor to the left
     */
    public navLeft(): void {
        if (this.j > 0) {     
            let transpose: InputMatrix = this.transposed();
            let transArr: string[][] = transpose.getArr();
            if (transArr[this.j].every(item => item === '') && this.j === transpose.getDim(0) - 1) {
                transArr.pop();
                this.arr = new InputMatrix(transArr).transposed().getArr();

                this.dims[1]--;
            }

            this.j--;
        } else if (this.i > 0) {
            // If the cursor is at the left-most edge move it up and to the right-most edge
            this.navUp();
            this.j = this.getDim(1) - 1;
        }
    }

    /**
     * Moves the cursor up
     */
    public navUp(): void {
        if (this.i > 0) {
            if (this.arr[this.i].every(item => item === '') && this.i === this.getDim(0) - 1) {
                this.arr.pop();
                this.dims[0]--;
            }
            this.i--;
        }
    }

    /**
     * Moves the cursor to the right
     */
    public navRight(): void {
        this.j++;
        if (this.arr[this.i].length <= this.j) {
            this.dims[1]++;
            for (let k = 0; k < this.getDim(0); k++) {
                this.arr[k].push('');
            }
        }
    }

    /**
     * Moves the cursor down
     */
    public navDown(): void {
        this.i++;
        if (!this.arr[this.i]) {
            this.arr[this.i] = new Array(this.arr[this.i - 1].length).fill('');
            this.dims[0]++;
        }
    }

    /**
     * Moves the cursor down a row and sets the current column to 0
     */
    public return(): void {
        this.navDown();
        this.j = 0;
    }

    /**
     * Executes a backspace being pressed
     */
    public backspace(): void {
        if (this.arr[this.i][this.j] !== '') {
            this.deleteChar();
        } else {
            this.navLeft();
        }
    }

    /**
     * Checks if the cursor is at (0, 0)
     */
    public atZeroZero(): boolean {
        return (this.i === 0 && this.j === 0);
    }
    //#endregion
}