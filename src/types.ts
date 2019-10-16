import InputMatrix from './models/inputMatrix';

export interface IObserver {
    update(source: IObservable): void;
}

export interface IObservable {
    addObserver(o: IObserver): void;
    removeObserver(o: IObserver): void;
    update(): void;
}

export enum Nav {
    LEFT = 0,
    UP,
    RIGHT,
    DOWN,
    RETURN,
    HOME,
    END
}

export interface IInputModel extends IObservable {
    calculation: TSymbol[];
    cursor: number;

    inMatrix(): boolean;

    addToCalc(...s: TSymbol[]): void;

    newMatrix(): void;
    /**
     * @param forwards Should default to true
     */
    endMatrix(forwards?: boolean): void;
    addToMatrix(c: string): void;

    shouldExitMatrix(del: boolean): boolean;

    /**
     * When not in a matrix only inputs of 1 and 2 do anything
     * @param dir 0 = Left; 1 = Up; 2 = Right; 3 = Down; 4 = Return; 5 = Home; 6 = End
     */
    nav(dir: Nav): void;
    backspace(): void;

    submit(): void;

    toString(): string;
}

export interface ICalcModel extends IInputModel {
    results: TSymbol[];
    error: string;
}

export interface IAnswerArea {
    calcArea: IInputModel;
    label: string;
    /**
     * -1 = Not Answered
     * 0 = Incorrect
     * 1 = Correct
     */
    correct: (-1|0|1);
}

export interface IQuestionModel extends IInputModel {
    question: string;
    answerAreas: IAnswerArea[];
    answers: string[];
    focusedArea: number;

    changeFocus(newFocus: number): void;
    getQuestion(type: string, options: {[key: string]: string}): Promise<void>;
    getFocusedArea(): IInputModel;
}

export interface IController {
    setModel(model: IInputModel): void;
    parseChar(key: string, keyCode: number): void;
}

export interface IQuestionController extends IController {
    changeFocus(newFocus: number): void;
    getQuestion(type: string, options: {[key: string]: string}): void;
}

export interface IQuestionButton {
    label: string;
    type: string;
}

export interface IAPIResult {
    type: 'matrix'|'no'|'vector';
    data: any;
}

export interface IAPIQuestionResult {
    question: string;
    answers: IAPIAns[];
}

export interface IAPIAns {
    label: string;
    value: string;
}

export interface IAPIError {
    message: string;
}

/**
 * Is either
 *  - string = number or expr
 *  - InputMatrix = matrix
 */
export type TSymbol = (string|InputMatrix);
