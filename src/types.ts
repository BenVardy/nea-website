import InputMatrix from './models/inputMatrix';

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
    calculation: TSymbol[];
    results: TSymbol[];
    error: string;

    cursor: number;

    addToCalc(...s: TSymbol[]): void;

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
    shouldExitMatrix(del: boolean): boolean;

    navLeft(): void;
    navRight(): void;
    navHome(): void;
    navEnd(): void;
    backspace(): void;

    calculate(): void;

    // getHtml(): HTMLElement;
}

export interface IView extends IObserver {
    inputChar(e: KeyboardEvent): void;
}

export interface IController {
    setModel(model: IModel): void;
    parseChar(key: string, keyCode: number): void;
}

export interface IAPIResult {
    type: 'matrix'|'no'|'vector';
    data: any;
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
