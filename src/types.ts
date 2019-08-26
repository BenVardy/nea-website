import BaseExpr from './models/baseExpr';
import DigitWrapper from './models/digitWrapper';
import InputMatrix from './models/inputMatrix';
import Symbol from './models/symbol';

export interface IObserver {
    update(source: IObservable): void;
}

export interface IObservable {
    addObserver(o: IObserver): void;
    removeObserver(o: IObserver): void;
    update(): void;
}

export interface IModel extends IObservable {
    inMatrix: boolean;

    addToCalc(s: Symbol<keyof ISymbolType>): void;

    newMatrix(): void;
    /**
     * @param forwards Should default to true
     */
    endMatrix(forwards?: boolean): void;
    addToMatrix(c: string): void;
    /**
     * @param dir 0 = Left; 1 = Up; 2 = Right; 3 = Down; 4 = Return
     */
    matrixNav(dir: (0|1|2|3|4)): void;
    matrixBackspace(): void;
    shouldExitMatrix(): boolean;

    navLeft(): void;
    navRight(): void;
    backspace(): void;

    calculate(): void;

    getHtml(): HTMLElement;
}

export interface IView extends IObserver {
    inputChar(e: KeyboardEvent): void;
}

export interface IController {
    setModel(model: IModel): void;
    parseChar(key: string, keyCode: number): void;
}

export interface ISymbolData {
    /**
     * @param cursor Only needed for the inputMatrix class
     */
    toLatex(cursor?: boolean): string;
    extract(): any;
}

export interface ISymbolType {
    [key: string]: ISymbolData;
    expr: BaseExpr;
    matrix: InputMatrix;
    no: DigitWrapper;
}

export interface ISymbolExtract<T extends keyof ISymbolType> {
    type: T;
    data: ISymbolType[T];
}
