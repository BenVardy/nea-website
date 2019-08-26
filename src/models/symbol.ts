import { ISymbolType } from "../types";

export default class Symbol<T extends keyof ISymbolType> {
    public data: ISymbolType[T];
    public type: T;

    public constructor(type: T, data: ISymbolType[T]) {
        this.type = type;
        this.data = data;
    }

    public toLatex(inMatrix: boolean = false): string {
        return this.data.toLatex(inMatrix);
    }

    public extract(): any {
        return this.data.extract();
    }
}
