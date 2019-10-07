import katex from 'katex';

import {IAnswer, IAPIQuestionResult, IInputModel, IObserver, IQuestionModel, TSymbol} from '../types';
import Calculator from './calculator';
import InputMatrix from './inputMatrix';

export default class QuestionsModel implements IQuestionModel {
    // These should be ignored here
    public calculation: TSymbol[];
    public cursor: number;

    public question: string;
    public answers: IAnswer[];
    public focusedArea: number;

    private observers: IObserver[];

    public constructor() {
        this.calculation = [];
        this.cursor = 0;

        this.question = '';
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

    //#region IInputModel
    public inMatrix(): boolean {
        return this.getFocusedArea().inMatrix();
    }

    public addToCalc(...s: TSymbol[]): void {
        for (let symbol of s) {
            if (InputMatrix.isInputMatrix(symbol) || symbol.match(/[\d\.]/)) {
                this.getFocusedArea().addToCalc(symbol);
            }
        }
        this.update();
    }

    public newMatrix(): void {
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

    public matrixNav(dir: (0|1|2|3|4)): void {
        this.getFocusedArea().matrixNav(dir);
        this.update();
    }

    public matrixBackspace(): void {
        this.getFocusedArea().matrixBackspace();
        this.update();
    }

    public shouldExitMatrix(del: boolean): boolean {
        return this.getFocusedArea().shouldExitMatrix(del);
    }

    public navLeft(): void {
        this.getFocusedArea().navLeft();
        this.update();
    }

    public navRight(): void {
        this.getFocusedArea().navRight();
        this.update();
    }

    public navEnd(): void {
        this.getFocusedArea().navEnd();
        this.update();
    }

    public navHome(): void {
        this.getFocusedArea().navHome();
        this.update();
    }

    public backspace(): void {
        this.getFocusedArea().backspace();
        this.update();
    }

    public toString(): string {
        return this.answers.map(area => area.toString()).join(' ');
    }
    //#endregion

    /**
     * Changes the focus answer box
     * @param newFocus The index of the new focus
     */
    public changeFocus(newFocus: number): void {
        if (newFocus >= this.answers.length) throw new Error('Invalid focus');

        this.focusedArea = newFocus;
        this.update();
    }

    public async getQuestion(type: string, options: {[key: string]: string}): Promise<void> {
        await fetch(`/api/question/${type}/?${this.encodeOptions(options)}`)
        .then(res => res.json())
        .then((json: IAPIQuestionResult) => {
            this.question = katex.renderToString(json.question);

            this.answers = json.answers.map(val => {
                return {
                    calcArea: new Calculator(),
                    correctAns: val.value,
                    label: val.label,
                    correct: false,
                } as IAnswer;
            });
        })
        .catch(err => console.error(err));

        this.update();
    }

    public submit(): void {
        for (let ans of this.answers) {
            let submitedAns: string = ans.calcArea.toString();
            ans.correct = submitedAns === ans.correctAns;
            console.log(ans.correct);
        }
        this.update();
    }

    public getFocusedArea(): IInputModel {
        return this.answers[this.focusedArea].calcArea;
    }

    private encodeOptions(options: {[key: string]: string}): string {
        return Object.keys(options).reduce((acc: string[], key) => (
            acc.concat(`${key}=${encodeURIComponent(options[key])}`
        )), []).join('&');
    }
}
