import katex from 'katex';

import { IAPIError, IAPIResult, IModel, IObserver, TSymbol } from '../types';
import InputMatrix from './inputMatrix';

export default class Calculator implements IModel {

    // Statics
    /**
     * Converts an array of numbers, expressions and matrices to latex
     * @param symArr The array of symbols
     */
    public static toLatex(symArr: TSymbol[], inMatrix: boolean, cursor: number, showCursor: boolean): string {

        let latex: string = symArr.map((sym, i) => {
            let part: string;
            if (typeof(sym) === 'string') {
                part = sym;
            } else {
                // Don't -1 for matrices as it goes in the matrix
                part = sym.toLatex(showCursor && inMatrix && cursor === i);
            }

            return part + (showCursor && !inMatrix && cursor - 1 === i ? '|' : '');
        }).join('');

        if (showCursor && !inMatrix && cursor === 0) latex = '|' + latex;

        latex = latex.replace(/\*/g, '\\cdot');
        // latex = latex.replace(/\((.*)\)(\|?)\/(\|?)\((.*)\)/g, '\\frac{$1$2}{$3$4}');

        latex = this.fixBrackets(latex).replace(/\(/g, '\\left(').replace(/\)/g, '\\right)');

        return latex;
    }

    /**
     * Adds brackets to the start / end to balance out brackets
     * @param calc The calculation string
     */
    private static fixBrackets(calc: string): string {
        let leftMatch = calc.match(/\(/g);
        let noLeft: number = leftMatch ? leftMatch.length : 0;

        let rightMatch = calc.match(/\)/g);
        let noRight: number = rightMatch ? rightMatch.length : 0;

        calc += ')'.repeat(Math.max(0, noLeft - noRight));
        calc = '('.repeat(Math.max(0, noRight - noLeft)) + calc;

        return calc;
    }

    // Properties
    public inMatrix: boolean;
    public calculation: TSymbol[];
    public results: TSymbol[];
    public error: string;

    public cursor: number;

    private observers: IObserver[];

    private clearNext: boolean;

    // Methods
    /**
     * Creates a new Calculator
     */
    public constructor() {
        this.calculation = [];
        this.observers = [];
        this.results = [];

        this.error = '';
        this.cursor = 0;

        this.clearNext = false;
        this.inMatrix = false;
    }

    /**
     * Adds a new observer
     * @param o The observer
     */
    public addObserver(o: IObserver): void {
        this.observers.push(o);
    }

    /**
     * Removes an observer
     * @param o The observer
     */
    public removeObserver(o: IObserver): void {
        let index: number = this.observers.indexOf(o);

        this.observers.splice(index, 1);
    }

    /**
     * Updates all observers
     */
    public update(): void {
        for (let o of this.observers) {
            o.update(this);
        }
    }

    /**
     * Adds a new item to the calculation
     * @param s The item to add
     */
    public addToCalc(...s: TSymbol[]): void {

        // if (this.clearNext) {
        //     this.clearNext = false;

        //     this.calculation = [];
        //     this.results = [];
        // }

        for (let item of s) {
            this.calculation.splice(this.cursor, 0, item);
            this.cursor++;
        }
        this.update();
    }

    /**
     * Creates a new Matrix for the calculation
     */
    public newMatrix(): void {
        if (this.inMatrix) throw new Error('Must end matrix first');

        this.addToCalc(new InputMatrix());
        // When addToCalc is called it adds 1 to the cursor event thought
        // we haven't moved on so we must fix the cursor by moving it back by 1
        this.cursor--;
        this.inMatrix = true;
        this.update();
    }

    /**
     * @param forwards should move the cursor forwards or just leave matrix. Defaults to true
     *
     * Closes the current matrix and adds it to the calculation
     */
    public endMatrix(forwards?: boolean): void {
        if (!this.inMatrix) throw new Error('Not in matrix');
        if (forwards === undefined) forwards = true;

        this.inMatrix = false;
        // Must manually move the cursor on
        if  (forwards) this.cursor++;
        this.update();
    }

    /**
     * Adds a character to the matrix
     * @param c The character
     */
    public addToMatrix(c: string): void {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        currentMatrix.addChar(c);
        this.update();
    }

    /**
     * Moves the cursor in the matrix
     * @param dir 0 = Left; 1 = Up; 2 = Right; 3 = Down; 4 = Return
     */
    public matrixNav(dir: (0|1|2|3|4)): void {
        let cm: InputMatrix = this.getCurrentMatrix();

        // Select the correct function based on dir
        [
            () => { if (cm) cm.navLeft(); },
            () => { if (cm) cm.navUp(); },
            () => { if (cm) cm.navRight(); },
            () => { if (cm) cm.navDown(); },
            () => { if (cm) cm.return(); }
        ][dir]();
        this.update();
    }

    /**
     * Performs a backspace on the current matrix
     */
    public matrixBackspace(): void {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        if (!this.shouldExitMatrix(true)) currentMatrix.backspace();
        else {
            this.navRight();
            this.backspace();

            this.inMatrix = false;
        }
        this.update();
    }

    /**
     * Checks if moving the cursor should exit the matrix
     */
    public shouldExitMatrix(del: boolean): boolean {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        return currentMatrix.atZeroZero() && (del ? currentMatrix._(0, 0) === '' : true);
    }

    /**
     * Move the cursor to the left
     */
    public navLeft(): void {
        if (this.cursor > 0) {
            this.cursor--;

            let currentItem = this.calculation[this.cursor];

            this.inMatrix = typeof(currentItem) !== 'string';
            this.update();
        }
    }

    /**
     * Move the cursor to the right
     */
    public navRight(): void {
        let currentItem = this.calculation[this.cursor];
        if (!this.inMatrix && currentItem && typeof(currentItem) !== 'string') this.inMatrix = true;
        else if (this.cursor < this.calculation.length) this.cursor++;
        this.update();
    }

    public navHome(): void {
        this.cursor = 0;
        this.update();
    }

    public navEnd(): void {
        this.cursor = this.calculation.length;
        this.update();
    }

    /**
     * Delete the last item
     */
    public backspace(): void {
        if (this.cursor > 0) {
            let wasInMatrix: boolean = this.inMatrix;
            this.calculation.splice(this.cursor - 1, 1);
            this.navLeft();

            if (!wasInMatrix && this.inMatrix) this.inMatrix = false;

            this.update();
        }
    }

    /**
     * Performs the final calculation
     */
    public calculate(): void {
        let {calculation} = this;
        let joinedCalc: string = '';
        try {
            joinedCalc = Calculator.fixBrackets(calculation.map(item => item.toString()).join(''));
        } catch (ex) {
            this.error = ex.message;

            this.update();
            return;
        }
        fetch(`/api?calc=${encodeURIComponent(joinedCalc)}`)
        .then(res => {
            if (res.status !== 200) throw res;
            else return res.json();
        })
        .then((json: IAPIResult[]) => {
            this.results = json.map(result => {
                // console.log(result.type);
                if (result.type === 'no') {
                    return result.data;
                } else {
                    return new InputMatrix(
                        JSON.parse(result.data).map((row: number[]) => (
                            row.map((data: number) => data.toString()
                        )))
                    );
                }
            });

            this.error = '';

            this.clearNext = true;
            this.update();
        })
        .catch(err => {
            err.json()
            .then((json: IAPIError) => {
                // console.error(json.message);
                this.error = json.message;
                this.update();
            });
        });
    }

    /**
     * Should only be run when in a matrix
     * Gets the current matrix
     */
    private getCurrentMatrix(): InputMatrix {
        if (!this.inMatrix) throw new Error('Not in matrix');
        let sym = this.calculation[this.cursor];
        if (!InputMatrix.isInputMatrix(sym)) throw new Error('Cursor not in matrix');

        return sym;
    }
}
