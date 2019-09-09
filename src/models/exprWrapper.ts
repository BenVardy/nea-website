import { ISymbolData } from '../types';

/**
 * Acts as the base expression for others to inherit from
 *
 * Expressions can either be a symbol (ie. x or +) or can be a letter
 * in a keyword (ie. **TODO**)
 */
export default class ExprWrapper implements ISymbolData {

    private data: string;

    public constructor(data: string) {
        this.data = data;
    }

    public toLatex(): string {
        switch (this.data) {
            case '*':
                return '\\cdot';
            default:
                return this.data;
        }
    }

    public toString(): string {
        return this.data;
    }

}
