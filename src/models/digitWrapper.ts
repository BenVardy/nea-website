import { ISymbolData } from '../types';

export default class DigitWrapper implements ISymbolData {
    private data: string;

    public constructor(data: string) {
        this.data = data;
    }

    /**
     * Gets the latex representation of the digit
     */
    public toLatex(): string {
        return this.data;
    }

    /**
     * Gets the string representation of the digit
     */
    public toString(): string {
        return this.data;
    }
}
