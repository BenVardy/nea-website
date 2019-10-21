import { IAPIError, IAPIResult, ICalcModel, IObserver, Nav, TSymbol } from '../types';
import InputMatrix from './inputMatrix';

export default class Calculator implements ICalcModel {

    // Statics
    /**
     * Converts an array of numbers, expressions and matrices to latex
     * @param symArr The array of symbols
     */
    // tslint:disable-next-line: max-line-length
    public static toLatex(symArr: TSymbol[], inMatrix: boolean, cursor: number, showCursor: boolean, commas: boolean = false): string {
        let latex: string = symArr.map((sym, i) => {
            let part: string;
            if (typeof(sym) === 'string') {
                part = sym;
            } else {
                // Don't -1 for matrices as it goes in the matrix
                part = sym.toLatex(showCursor && inMatrix && cursor === i);
            }

            return part + (showCursor && !inMatrix && cursor - 1 === i ? '|' : '');
        }).join(commas ? ',' : '');

        if (showCursor && !inMatrix && cursor === 0) latex = '|' + latex;

        latex = latex.replace(/\*/g, '\\cdot').replace(/\^/g, '\\char`\\^');

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
    public calculation: TSymbol[];
    public results: TSymbol[];
    public error: string;
    public cursor: number;

    // tslint:disable-next-line: variable-name
    private _inMatrix: boolean;
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
        this._inMatrix = false;
    }

    public inMatrix(): boolean {
        return this._inMatrix;
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

        if (this.clearNext) this.resetCalc();

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
        if (this._inMatrix) throw new Error('Must end matrix first');

        this.addToCalc(new InputMatrix());
        // When addToCalc is called it adds 1 to the cursor event thought
        // we haven't moved on so we must fix the cursor by moving it back by 1
        this.cursor--;
        this._inMatrix = true;
        this.update();
    }

    /**
     * @param forwards should move the cursor forwards or just leave matrix. Defaults to true
     *
     * Closes the current matrix and adds it to the calculation
     */
    public endMatrix(forwards?: boolean): void {
        if (!this._inMatrix) throw new Error('Not in matrix');
        if (forwards === undefined) forwards = true;

        this._inMatrix = false;
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
     * Checks if moving the cursor should exit the matrix
     */
    public shouldExitMatrix(del: boolean): boolean {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        return currentMatrix.atZeroZero() && (del ? currentMatrix._(0, 0) === '' : true);
    }

    /**
     * When not in a matrix 1, 3, and 4 do nothing
     * @param dir 0 = Left; 1 = Up; 2 = Right; 3 = Down; 4 = Return; 5 = Home; 6 = End
     * @param clear Clear the results. Defaults to true
     */
    public nav(dir: Nav, clear?: boolean): void {
        if (clear === undefined) clear = true;

        if (this.clearNext && clear) this.resetCalc();

        if (this.inMatrix()) {
            this.matrixNav(dir);
        } else {
            // The blank functions are for values of dir that do nothing
            // when not in a matrix
            [
                () => this.navLeft(),
                () => {},
                () => this.navRight(),
                () => {},
                () => {},
                () => this.navHome(),
                () => this.navEnd()
            ][dir]();
        }
    }

    /**
     * Delete the last item
     */
    public backspace(): void {
        switch (this.inMatrix()) {
            case true:
                let exited: boolean = this.matrixBackspace();
                if (!exited) break;
            default:
                if (this.clearNext) this.resetCalc();
                if (this.cursor > 0) {
                    let wasInMatrix: boolean = this._inMatrix;
                    this.calculation.splice(this.cursor - 1, 1);
                    this.navLeft();

                    this._inMatrix = false;
                }
                break;
        }

        this.update();
    }

    /**
     * Performs the final calculation
     */
    public submit(): void {
        let {calculation} = this;
        let joinedCalc: string = '';

        this.clearNext = true;

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

    public toString(): string {
        return this.calculation.map(val => {
            if (typeof(val) === 'string') return val;
            else return val.toString();
        }).join('');
    }

    /**
     * Moves the cursor in the matrix
     * @param dir 0 = Left; 1 = Up; 2 = Right; 3 = Down; 4 = Return
     */
    private matrixNav(dir: Nav): void {
        let cm: InputMatrix = this.getCurrentMatrix();

        if (dir >= 5) return;

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
    private matrixBackspace(): boolean {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        if (!this.shouldExitMatrix(true)) currentMatrix.backspace();
        else {
            this.navRight();
            return true;
        }
        return false;
    }

    /**
     * Move the cursor to the left
     */
    private navLeft(): void {
        if (this.cursor > 0) {
            this.cursor--;

            let currentItem = this.calculation[this.cursor];

            this._inMatrix = typeof(currentItem) !== 'string';
            this.update();
        }
    }

    /**
     * Move the cursor to the right
     */
    private navRight(): void {
        let currentItem = this.calculation[this.cursor];
        if (!this._inMatrix && currentItem && typeof(currentItem) !== 'string') this._inMatrix = true;
        else if (this.cursor < this.calculation.length) this.cursor++;
        this.update();
    }

    private navHome(): void {
        this.cursor = 0;
        this.update();
    }

    private navEnd(): void {
        this.cursor = this.calculation.length;
        this.update();
    }

    /**
     * Should only be run when in a matrix
     * Gets the current matrix
     */
    private getCurrentMatrix(): InputMatrix {
        if (!this._inMatrix) throw new Error('Not in matrix');
        let sym = this.calculation[this.cursor];
        if (!InputMatrix.isInputMatrix(sym)) throw new Error('Cursor not in matrix');

        return sym;
    }

    /**
     * Resets the calculation
     */
    private resetCalc(): void {
        this.clearNext = false;
        this.results = [];
        this.error = '';
    }
}
