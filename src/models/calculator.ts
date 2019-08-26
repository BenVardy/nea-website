import katex from 'katex';

import { IModel, IObserver, ISymbolType } from '../types';
import InputMatrix from './inputMatrix';
import Symbol from './symbol';

export default class Calculator implements IModel {

    public inMatrix: boolean;
    // Properties
    private calculation: Array<Symbol<keyof ISymbolType>>;
    private observers: IObserver[];

    private cursor: number;

    // Methods
    /**
     * Creates a new Calculator
     */
    public constructor() {
        this.calculation = [];
        this.observers = [];
        this.cursor = 0;

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
    public addToCalc(s: Symbol<keyof ISymbolType>): void {
        this.calculation.splice(this.cursor, 0, s);
        this.cursor++;
        this.update();
    }

    /**
     * Creates a new Matrix for the calculation
     */
    public newMatrix(): void {
        if (this.inMatrix) throw new Error('Must end matrix first');

        this.addToCalc(new Symbol('matrix', new InputMatrix()));
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

        if (!this.shouldExitMatrix()) currentMatrix.backspace();
        else {
            this.navRight();
            this.backspace();
        }
        this.update();
    }

    /**
     * Checks if moving the cursor should exit the matrix
     */
    public shouldExitMatrix(): boolean {
        let currentMatrix: InputMatrix = this.getCurrentMatrix();

        return currentMatrix.atZeroZero();
    }

    /**
     * Move the cursor to the left
     */
    public navLeft(): void {
        if (this.cursor > 0) {
            this.cursor--;

            let currentItem = this.calculation[this.cursor];

            this.inMatrix = (currentItem && currentItem.type === 'matrix');
            this.update();
        }
    }

    /**
     * Move the cursor to the right
     */
    public navRight(): void {
        let currentItem = this.calculation[this.cursor];
        if (!this.inMatrix && currentItem && currentItem.type === 'matrix') this.inMatrix = true;
        else if (this.cursor < this.calculation.length) this.cursor++;
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
        throw new Error('Not implemented');
    }

    /**
     * Gets the html representation of the calculation
     */
    public getHtml(): HTMLElement {
        let root: HTMLElement = document.createElement('div');

        root.className = 'calculation';

        let calcString: string = '';
        if (!this.inMatrix && this.cursor === 0) calcString += '|';

        for (let i = 0; i < this.calculation.length; i++) {
            let item = this.calculation[i];
            calcString += item.toLatex((this.inMatrix && i === this.cursor));
            if (!this.inMatrix && i === this.cursor - 1) calcString += '|';
        }

        katex.render(calcString, root);

        return root;
    }

    /**
     * Should only be run when in a matrix
     * Gets the current matrix
     */
    private getCurrentMatrix(): InputMatrix {
        if (!this.inMatrix) throw new Error('Not in matrix');
        let sym = this.calculation[this.cursor];
        if (sym && sym.type !== 'matrix') throw new Error('Cursor not in matrix');

        return (sym.data as InputMatrix);
    }
}
