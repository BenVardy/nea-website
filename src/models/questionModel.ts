import katex from 'katex';

import {IAnswerArea, IAPIQuestionResult, IInputModel, IObserver, IQuestionModel, Nav, TSymbol} from '../types';
import Calculator from './calculator';
import InputMatrix from './inputMatrix';

import question from '../../server/offlineFunctions/question';

/**
 * The model behind the questions view
 */
export default class QuestionsModel implements IQuestionModel {

    // Properties
    // These should be ignored here
    public calculation: TSymbol[];
    public cursor: number;

    public question: string;
    public answerAreas: IAnswerArea[];
    public answers: string[];
    public focusedArea: number;

    public options = {
        noRows: '3',
        noCols: '3',
        maxNo: '10',
        ints: 'true'
    } as {[key: string]: string};

    private observers: IObserver[];

    // Methods
    /**
     * Sets up a new Question Model
     */
    public constructor() {
        this.calculation = [];
        this.cursor = 0;

        this.question = '';
        this.answerAreas = [];
        this.answers = [];
        this.focusedArea = 0;

        this.observers = [];
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
     * Gets the value of an option
     *
     * @param name The name of the option to get
     */
    public getOption(name: string): string {
        return this.options[name] || '';
    }

    /**
     * Sets the value of an option for the questions
     *
     * @param name The name of the option to set
     * @param value The value to set it to
     */
    public setOption(name: string, value: string) {
        if (Object.keys(this.options).includes(name)) {
            this.options[name] = value;
        }

        this.update();
    }

    //#region IInputModel
    public inMatrix(): boolean {
        return this.getFocusedArea().inMatrix();
    }

    public getCurrentMatrixDims(): number[] {
        if (!this.inMatrix()) throw new Error('Not in matrix');

        return this.getFocusedArea().getCurrentMatrixDims();
    }

    public addToCalc(...s: TSymbol[]): void {
        for (let symbol of s) {
            // Don't allow multiple entries
            if (InputMatrix.isInputMatrix(symbol) || symbol.match(/[\-\d\.]/)) {
                this.getFocusedArea().addToCalc(symbol);
            }
        }
        this.update();
    }

    public newMatrix(): void {
        if (this.getFocusedArea().calculation.length > 0) return;
        this.getFocusedArea().newMatrix();
        this.update();
    }

    public endMatrix(forwards?: boolean): void {
        this.getFocusedArea().endMatrix(forwards);
        this.update();
    }

    public addToMatrix(c: string): void {
        this.getFocusedArea().addToMatrix(c);
        this.update();
    }

    // Safe to just pass off to area
    public nav(dir: Nav, clear?: boolean): void {
        this.getFocusedArea().nav(dir, clear);
        this.update();
    }

    public shouldExitMatrix(del: boolean): boolean {
        return this.getFocusedArea().shouldExitMatrix(del);
    }

    public backspace(right: boolean): void {
        this.getFocusedArea().backspace(right);
        this.update();
    }

    public toString(): string {
        return this.answers.map(area => area.toString()).join(' ');
    }
    //#endregion

    /**
     * Changes the focus answer box
     *
     * @param newFocus The index of the new focus
     */
    public changeFocus(newFocus: number): void {
        if (newFocus >= this.answers.length) throw new Error('Invalid focus');

        this.focusedArea = newFocus;
        this.update();
    }

    /**
     * Gets a new question
     *
     * @param type The type-string of the question
     * @param options The options for the question
     */
    public async getQuestion(type: string): Promise<void> {
        // await fetch(`/api/question/${type}?${this.encodeOptions(this.options)}`)
        await question(type, this.options)
        // .then(res => res.json())
        .then((json: IAPIQuestionResult) => {
            this.question = json.question.replace(/\$\$(.*)\$\$/g, (match): string => {
                return katex.renderToString(match.substring(2, match.length - 2));
            });

            this.answerAreas = json.answers.map(val => {
                return {
                    calcArea: new Calculator(),
                    label: val.label,
                    correct: -1,
                } as IAnswerArea;
            });
            this.answers = json.answers.map(val => val.value);

            this.focusedArea = 0;
        })
        .catch(err => console.error(err));

        this.update();
    }

    /**
     * Checks the answers given
     */
    public submit(): void {
        // Indices of questions answered correctly
        let corrAnsI: number[] = [];

        for (let ans of this.answerAreas) {
            ans.correct = 0;
            for (let i = 0; i < this.answers.length; i++) {
                let correctAns: string = this.answers[i];
                let submittedAns: string = ans.calcArea.toString();

                if (!corrAnsI.includes(i) && submittedAns === correctAns) {
                    ans.correct = 1;
                    corrAnsI.push(i);
                }
            }
        }
        this.update();
    }

    /**
     * Gets the current area focused
     */
    private getFocusedArea(): IInputModel {
        return this.answerAreas[this.focusedArea].calcArea;
    }

    /**
     * Converts an object to a url string
     * @param options The options object to encode
     */
    private encodeOptions(options: {[key: string]: any}): string {
        return Object.keys(options).reduce((acc: string[], key) => (
            acc.concat(`${key}=${encodeURIComponent(options[key])}`
        )), []).join('&');
    }
}
